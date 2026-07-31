import { getCategorias } from "../services/categorias.service.js";

// Controlador para obtener todas las categorias
export const getCategoriasController = async (req, res) => {
    try {
        const categorias = await getCategorias();
        res.json(categorias);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
