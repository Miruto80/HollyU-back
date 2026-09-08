import { getTipos_bota } from "../services/tipo_bota.service.js";

export const getTipos_botaController = async (req, res) => {
  try {
    const tiposBota = await getTipos_bota();
    res.json(tiposBota);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
