import { getModelos } from "../services/modelos.service.js";

// Controlador para obtener todas las modelos
export const getModelosController = async (req, res) => {
    try {
        const modelos = await getModelos();
        res.json(modelos);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
