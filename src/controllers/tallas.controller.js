import { getTallas } from "../services/tallas.service.js";

// Controlador para obtener todas las tallas
export const getTallasController = async (req, res) => {
    try {
        const tallas = await getTallas();
        res.json(tallas);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
