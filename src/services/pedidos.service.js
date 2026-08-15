import sequelize from '../database/db.js';
import {
  Pedidos,
  Clientes,
  Estados_pedido,
  Tipos_venta,
  Detalle_pedido,
  Productos,
  Modelos,
  Tipos_tela,
  Colores,
  Tallas,
  Producto_variantes,
  Pagos,
  Metodos_pago,
  Estados_pago
} from "../models/index.js";

export const getPedidos = async (filters = {}) => {
  try {
    const where = {};

    if (filters.cliente_id) {
      where.cliente_id = filters.cliente_id;
    }

    return await Pedidos.findAll({
      where,
      include: [
        { model: Clientes, attributes: ['id', 'nombres', 'apellidos', 'email', 'telefono'] },
        { model: Estados_pedido, attributes: ['id', 'nombre'] },
        { model: Tipos_venta, attributes: ['id', 'nombre'] }
      ],
      order: [['fecha', 'DESC']]
    });
  } catch (error) {
    console.error('Error fetching orders:', error);
    throw error;
  }
};

export const getPedidosByCliente = async (clienteId) => {
  try {
    return await getPedidos({ cliente_id: clienteId });
  } catch (error) {
    console.error('Error fetching client orders:', error);
    throw error;
  }
};

export const getPedidoById = async (id) => {
  try {
    return await Pedidos.findByPk(id, {
      include: [
        { model: Clientes, attributes: ['id', 'nombres', 'apellidos', 'email', 'telefono'] },
        { model: Estados_pedido, attributes: ['id', 'nombre'] },
        { model: Tipos_venta, attributes: ['id', 'nombre'] },
        {
          model: Detalle_pedido,
          include: [
            { model: Productos, attributes: ['id', 'codigo', 'nombre'] },
            { model: Modelos, attributes: ['id', 'nombre'] },
            { model: Tipos_tela, attributes: ['id', 'nombre'] },
            { model: Colores, attributes: ['id', 'nombre', 'codigo_hex'] },
            { model: Tallas, attributes: ['id', 'nombre'] },
            { model: Producto_variantes }
          ]
        },
        {
          model: Pagos,
          include: [
            { model: Metodos_pago },
            { model: Estados_pago }
          ]
        }
      ]
    });
  } catch (error) {
    console.error('Error fetching order detail:', error);
    throw error;
  }
};

export const postPedido = async (payload) => {
  const t = await sequelize.transaction();

  try {
    const {
      cliente_id,
      usuario_id,
      tipo_venta_id,
      estado_pedido_id,
      total_bs,
      observaciones,
      items // [{ producto_id, modelo_id, tipo_tela_id, color_id, talla_id, variante_id, cantidad, precio, descuento }]
    } = payload;

    if (!items || items.length === 0) {
      throw new Error('El pedido debe tener al menos un producto');
    }

    // Validar regla "uno u otro" por cada línea
    for (const item of items) {
      const esPersonalizado = Boolean(item.variante_id);
      const esNormal = Boolean(item.producto_id && item.modelo_id && item.tipo_tela_id && item.talla_id);

      if (!esPersonalizado && !esNormal) {
        throw new Error('Cada producto del pedido debe tener variante_id (personalizado) o producto_id/modelo_id/tipo_tela_id/talla_id (normal)');
      }

      if (esPersonalizado && esNormal) {
        throw new Error('Un producto no puede ser normal y personalizado al mismo tiempo');
      }
    }

    // Calcular subtotal y descuento total sumando cada línea
    let subtotal = 0;
    let descuentoTotal = 0;

    for (const item of items) {
      subtotal += item.precio * item.cantidad;
      descuentoTotal += item.descuento || 0;
    }

    const total = subtotal - descuentoTotal;

    // Calcular fecha de entrega estimada = la más larga entre los productos del pedido
    let maxTiempoFabricacion = 7; // valor por defecto si no se puede resolver

    const productosIds = items.filter(i => i.producto_id).map(i => i.producto_id);
    if (productosIds.length > 0) {
      const productos = await Productos.findAll({
        where: { id: productosIds },
        attributes: ['id', 'tiempo_fabricacion']
      });
      const tiempos = productos.map(p => p.tiempo_fabricacion || 7);
      maxTiempoFabricacion = Math.max(...tiempos, 7);
    }

    const fechaEntregaEstimada = new Date();
    fechaEntregaEstimada.setDate(fechaEntregaEstimada.getDate() + maxTiempoFabricacion);

    // Crear el pedido
    const pedido = await Pedidos.create({
      cliente_id,
      usuario_id: usuario_id || null,
      tipo_venta_id,
      estado_pedido_id,
      subtotal,
      descuento: descuentoTotal,
      total,
      total_bs,
      fecha_entrega_estimada: fechaEntregaEstimada,
      observaciones
    }, { transaction: t });

    // Crear cada línea del detalle
    for (const item of items) {
      await Detalle_pedido.create({
        pedido_id: pedido.id,
        producto_id: item.producto_id || null,
        modelo_id: item.modelo_id || null,
        tipo_tela_id: item.tipo_tela_id || null,
        color_id: item.color_id || null,
        talla_id: item.talla_id || null,
        variante_id: item.variante_id || null,
        cantidad: item.cantidad,
        precio: item.precio,
        descuento: item.descuento || 0
      }, { transaction: t });
    }

    await t.commit();
    return getPedidoById(pedido.id);

  } catch (error) {
    await t.rollback();
    console.error('Error creating order:', error);
    throw error;
  }
};