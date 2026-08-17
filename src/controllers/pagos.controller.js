import { getPagos } from "../services/pagos.service.js";

export const getPagosController = async (req, res) => {
  try {
    const { estado_pago_id } = req.query;
    const pagos = await getPagos({ estado_pago_id });
    res.json(pagos);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};