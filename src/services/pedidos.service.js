import fs from 'fs';
import path from 'path';
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
  Pagos,
  Metodos_pago,
  Estados_pago,
  Producciones
} from "../models/index.js";

const ESTADO_PAGO_VERIFICADO = 2;
const ESTADO_PAGO_RECHAZADO = 3;

const ESTADO_PEDIDO_EN_PRODUCCION = 2;
const ESTADO_PEDIDO_LISTO_ENTREGA = 3;
const ESTADO_PEDIDO_CANCELADO = 5;

const ESTADO_PRODUCCION_INICIAL = 1; 

export const getPedidos = async (filters = {}) => {
  try {
    const where = {};
    if (filters.cliente_id) where.cliente_id = filters.cliente_id;

    return await Pedidos.findAll({
      where,
      include: [
        { model: Clientes, attributes: ['id', 'nombres', 'apellidos', 'email', 'telefono'] },
        { model: Estados_pedido, attributes: ['id', 'nombre'] },
        { model: Tipos_venta, attributes: ['id', 'nombre'] },
        {
          model: Pagos,
          attributes: ['id', 'referencia', 'estado_pago_id'],
          include: [{ model: Estados_pago, attributes: ['id', 'nombre'] }]
        }
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
      items, // [{ producto_id, modelo_id, tipo_tela_id, color_id, talla_id, cantidad, precio, descuento }]

      // datos del pago
      metodo_pago_id,
      estado_pago_id,
      referencia,
      banco_origen,
      banco_destino,
      telefono_emisor,
      archivo // req.file del comprobante
    } = payload;

    if (!items || items.length === 0) {
      throw new Error('El pedido debe tener al menos un producto');
    }

    // Cada línea debe identificar el producto y sus opciones del catálogo.
    for (const item of items) {
      const esNormal = Boolean(item.producto_id && item.modelo_id && item.tipo_tela_id && item.talla_id);

      if (!esNormal) {
        throw new Error('Cada producto del pedido debe tener producto_id/modelo_id/tipo_tela_id/talla_id');
      }
    }

    // Calcular subtotal y descuento
    let subtotal = 0;
    let descuentoTotal = 0;
    for (const item of items) {
      subtotal += item.precio * item.cantidad;
      descuentoTotal += item.descuento || 0;
    }
    const total = subtotal - descuentoTotal;

    // Fecha de entrega estimada = la más larga entre los productos del pedido
    let maxTiempoFabricacion = 7;
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
        cantidad: item.cantidad,
        precio: item.precio,
        descuento: item.descuento || 0
      }, { transaction: t });
    }

    // Mover el comprobante de tmp a su carpeta final
    let comprobantePath = null;
    if (archivo) {
      const destFolder = path.join('uploads', 'pagos');
      if (!fs.existsSync(destFolder)) {
        fs.mkdirSync(destFolder, { recursive: true });
      }
      const destPath = path.join(destFolder, archivo.filename);
      fs.renameSync(archivo.path, destPath);
      comprobantePath = `/uploads/pagos/${archivo.filename}`;
    }

    // Crear el pago asociado
    await Pagos.create({
      pedido_id: pedido.id,
      metodo_pago_id,
      estado_pago_id,
      monto: total,
      referencia,
      banco_origen,
      banco_destino,
      telefono_emisor,
      comprobante: comprobantePath
    }, { transaction: t });

    await t.commit();
    return getPedidoById(pedido.id);

  } catch (error) {
    await t.rollback();
    if (payload.archivo) fs.unlink(payload.archivo.path, () => {});
    console.error('Error creating order:', error);
    throw error;
  }
};


export const putPagoEstado = async (pedidoId, estadoPagoId) => {
  const t = await sequelize.transaction();

  try {
    const estadoPagoIdNum = Number(estadoPagoId);

    if (![ESTADO_PAGO_VERIFICADO, ESTADO_PAGO_RECHAZADO].includes(estadoPagoIdNum)) {
      throw new Error('Estado de pago no válido, solo se permite Verificado o Rechazado');
    }

    const pago = await Pagos.findOne({ where: { pedido_id: pedidoId } });
    if (!pago) throw new Error('No se encontró el pago asociado a este pedido');

    await pago.update({ estado_pago_id: estadoPagoIdNum }, { transaction: t });

    if (estadoPagoIdNum === ESTADO_PAGO_RECHAZADO) {
      await Pedidos.update(
        { estado_pedido_id: ESTADO_PEDIDO_CANCELADO },
        { where: { id: pedidoId }, transaction: t }
      );
      await t.commit();
      return getPedidoById(pedidoId);
    }
    // Si el pago fue verificado, revisar stock y actualizar estado del pedido
    const detalle = await Detalle_pedido.findAll({
      where: { pedido_id: pedidoId },
      include: [{ model: Productos, attributes: ['id', 'stock'] }],
      transaction: t
    });

    const lineasSinStock = [];

    for (const item of detalle) {
      if (!item.Producto) continue; // pedido personalizado, sin producto_id directo

      if (item.Producto.stock >= item.cantidad) {
        // Hay stock suficiente: se descuenta
        await Productos.decrement('stock', {
          by: item.cantidad,
          where: { id: item.Producto.id },
          transaction: t
        });
      } else {
        lineasSinStock.push(item);
      }
    }

    const necesitaProduccion = lineasSinStock.length > 0;

    if (necesitaProduccion) {
      await Pedidos.update(
        { estado_pedido_id: ESTADO_PEDIDO_EN_PRODUCCION },
        { where: { id: pedidoId }, transaction: t }
      );

      for (const item of lineasSinStock) {
        await Producciones.create({
          pedido_id: pedidoId,
          estado_produccion_id: ESTADO_PRODUCCION_INICIAL,
          fecha_inicio: new Date()
        }, { transaction: t });
      }
    } else {
      await Pedidos.update(
        { estado_pedido_id: ESTADO_PEDIDO_LISTO_ENTREGA },
        { where: { id: pedidoId }, transaction: t }
      );
    }

    await t.commit();
    return getPedidoById(pedidoId);

  } catch (error) {
    await t.rollback();
    console.error(error);
    throw error;
  }
};

export const avanzarEstadoPedido = async (pedidoId) => {
  const pedido = await Pedidos.findByPk(pedidoId, {
    include: [
      { model: Estados_pedido },
      { model: Pagos, include: [{ model: Estados_pago }] }
    ]
  });

  if (!pedido) throw new Error('Pedido no encontrado');

  const estadoPago = pedido.Pagos?.[0]?.Estados_pago?.nombre;
  if (estadoPago !== 'Verificado') {
    throw new Error('Solo se puede cambiar el estado de un pedido con pago verificado');
  }

  const siguienteEstado = {
    'En producción': 'Listo para entrega',
    'Listo para entrega': 'Entregado'
  }[pedido.Estados_pedido?.nombre];

  if (!siguienteEstado) {
    throw new Error('El pedido no tiene un siguiente estado disponible');
  }

  const estado = await Estados_pedido.findOne({ where: { nombre: siguienteEstado } });
  if (!estado) throw new Error(`No existe el estado de pedido ${siguienteEstado}`);

  await pedido.update({ estado_pedido_id: estado.id });
  return getPedidoById(pedidoId);
};