import { Producciones, Estados_produccion, Pedidos, Clientes } from "../models/index.js";

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