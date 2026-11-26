import { getProducciones, avanzarProduccion } from "../services/producciones.service.js";

export const getProduccionesController = async (req, res) => {
  try {
    const producciones = await getProducciones(req.query);
    res.json(producciones);
  } catch (error) {
    res.status(error.statusCode || 500).json({ message: error.message });
  }
};

export const patchAvanzarController = async (req, res) => {
  try {
    const produccion = await avanzarProduccion(req.params.id);
    res.json(produccion);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};