import { Pagos, Pedidos, Metodos_pago, Estados_pago } from "../models/index.js";

export const getPagos = async (filters = {}) => {
  try {
    const where = {};
    if (filters.estado_pago_id) where.estado_pago_id = filters.estado_pago_id;

    return await Pagos.findAll({
      where,
      include: [
        { model: Metodos_pago, attributes: ['id', 'nombre'] },
        { model: Estados_pago, attributes: ['id', 'nombre'] },
        { model: Pedidos, attributes: ['id', 'total_bs'] }
      ],
      order: [['fecha', 'DESC']]
    });
  } catch (error) {
    console.error('Error fetching payments:', error);
    throw error;
  }
};