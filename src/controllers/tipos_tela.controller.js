import { getTipos_tela } from "../services/tipos_tela.service.js";

// Controlador para obtener todas las categorias
export const getTipos_telaController = async (req, res) => {
    try {
        const categorias = await getTipos_tela();
        res.json(categorias);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
