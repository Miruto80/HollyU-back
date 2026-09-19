import { getModelos } from "../services/modelos.service.js";

export const getModelosController = async (req, res) => {
  try {
    const modelos = await getModelos();
    res.json(modelos);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};