import { Producciones, Estados_produccion, Pedidos, Clientes } from "../models/index.js";
import sequelize from '../database/db.js';

export const getProducciones = async (filters = {}) => {
  try {
    const where = {};
    if (filters.estado_produccion_id) where.estado_produccion_id = filters.estado_produccion_id;

    return await Producciones.findAll({
      where,
      include: [
        { model: Estados_produccion, attributes: ['id', 'nombre', 'orden'] },
        {
          model: Pedidos,
          attributes: ['id', 'fecha_entrega_estimada'],
          include: [{ model: Clientes, attributes: ['nombres', 'apellidos'] }]
        }
      ],
      order: [['fecha_inicio', 'DESC']]
    });
  } catch (error) {
    console.error('Error fetching producciones:', error.message);
    throw error;
  }
};

export const avanzarProduccion = async (produccionId) => {
  const t = await sequelize.transaction();

  try {
    const produccion = await Producciones.findByPk(produccionId, { transaction: t });
    if (!produccion) throw new Error('Producción no encontrada');

    const estadoActual = await Estados_produccion.findByPk(produccion.estado_produccion_id, { transaction: t });
    if (!estadoActual) throw new Error('Estado de producción actual no válido');

    const siguienteEstado = await Estados_produccion.findOne({
      where: { orden: estadoActual.orden + 1 },
      transaction: t
    });

    if (!siguienteEstado) {
      throw new Error('Esta producción ya está en su etapa final');
    }

    const estadoMaximo = await Estados_produccion.max('orden', { transaction: t });
    const esFinal = siguienteEstado.orden === estadoMaximo;

    await produccion.update({
      estado_produccion_id: siguienteEstado.id,
      fecha_final: esFinal ? new Date() : produccion.fecha_final
    }, { transaction: t });

    await t.commit();

    return Producciones.findByPk(produccionId, {
      include: [
        { model: Estados_produccion, attributes: ['id', 'nombre', 'orden'] },
        {
          model: Pedidos,
          attributes: ['id', 'fecha_entrega_estimada'],
          include: [{ model: Clientes, attributes: ['nombres', 'apellidos'] }]
        }
      ]
    });
  } catch (error) {
    await t.rollback();
    console.error(error);
    throw error;
  }
};