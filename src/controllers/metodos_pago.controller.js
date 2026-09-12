import { getMetodos_pago } from "../services/metodos_pago.service.js";

export const getMetodos_pagoController = async (req, res) => {
  try {
    const metodosPago = await getMetodos_pago();
    res.json(metodosPago);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};