import {
  Cotizaciones,
  Clientes,
  Estados_cotizacion,
  Detalle_cotizacion,
  Productos,
  Pedidos,
  Detalle_pedido,
  Estados_pedido,
  Tipos_venta,
  Producciones,
  Estados_produccion
} from '../models/index.js';
import sequelize from '../database/db.js';

export const getCotizaciones = async () => {
  return Cotizaciones.findAll({
    include: [
      { model: Clientes, attributes: ['id', 'nombres', 'apellidos', 'email'] },
      { model: Estados_cotizacion, attributes: ['id', 'nombre'] },
      {
        model: Detalle_cotizacion,
        attributes: ['id', 'cantidad', 'precio'],
        include: [{ model: Productos, attributes: ['id', 'codigo', 'nombre'] }]
      }
    ],
    order: [['fecha', 'DESC']]
  });
};

export const pasarCotizacionAProduccion = async (cotizacionId) => {
  const transaction = await sequelize.transaction();

  try {
    const cotizacion = await Cotizaciones.findByPk(cotizacionId, {
      include: [
        { model: Estados_cotizacion, attributes: ['id', 'nombre'] },
        { model: Detalle_cotizacion, attributes: ['producto_id', 'cantidad', 'precio'] }
      ],
      transaction
    });

    if (!cotizacion) throw new Error('Cotización no encontrada');

    const estadoActual = cotizacion.Estados_cotizacion?.nombre?.toLowerCase();
    if (estadoActual === 'rechazada' || estadoActual === 'cancelada') {
      throw new Error('No se puede pasar a producción una cotización rechazada o cancelada');
    }

    const [estadoCotizacionProduccion] = await Estados_cotizacion.findOrCreate({
      where: { nombre: 'En producción' },
      transaction
    });
    const estadoPedidoProduccion = await Estados_pedido.findOne({
      where: { nombre: 'En producción' },
      transaction
    });
    const tipoVenta = await Tipos_venta.findOne({
      where: { nombre: 'Web' },
      transaction
    });
    const estadoProduccionInicial = await Estados_produccion.findOne({
      where: { orden: 1 },
      transaction
    });

    if (!estadoPedidoProduccion || !tipoVenta || !estadoProduccionInicial) {
      throw new Error('Faltan estados o tipo de venta configurados para crear la producción');
    }

    let pedido = await Pedidos.findOne({
      where: { cotizacion_id: cotizacion.id },
      transaction
    });

    if (!pedido) {
      pedido = await Pedidos.create({
        cliente_id: cotizacion.cliente_id,
        cotizacion_id: cotizacion.id,
        tipo_venta_id: tipoVenta.id,
        estado_pedido_id: estadoPedidoProduccion.id,
        subtotal: cotizacion.subtotal,
        descuento: cotizacion.descuento,
        total: cotizacion.total,
        fecha_entrega_estimada: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        observaciones: cotizacion.observaciones
      }, { transaction });

      await Detalle_pedido.bulkCreate(
        cotizacion.Detalle_cotizacions.map((detalle) => ({
          pedido_id: pedido.id,
          producto_id: detalle.producto_id,
          cantidad: detalle.cantidad,
          precio: detalle.precio,
          descuento: 0
        })),
        { transaction }
      );
    }

    const produccion = await Producciones.findOne({
      where: { pedido_id: pedido.id },
      transaction
    });

    if (!produccion) {
      await Producciones.create({
        pedido_id: pedido.id,
        estado_produccion_id: estadoProduccionInicial.id,
        fecha_inicio: new Date()
      }, { transaction });
    }

    await cotizacion.update(
      { estado_cotizacion_id: estadoCotizacionProduccion.id },
      { transaction }
    );

    await transaction.commit();

    return getCotizaciones().then((cotizaciones) =>
      cotizaciones.find((item) => item.id === Number(cotizacionId))
    );
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};
