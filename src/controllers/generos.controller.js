import { getGeneros } from "../services/generos.services.js";

// Controlador para obtener todas las categorias
export const getGenerosController = async (req, res) => {
    try {
        const categorias = await getGeneros();
        res.json(categorias);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
