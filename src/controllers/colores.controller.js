import { getColores } from "../services/colores.service.js";

// Controlador para obtener todos los colores
export const getColoresController = async (req, res) => {
    try {
        const colores = await getColores();
        res.json(colores);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
