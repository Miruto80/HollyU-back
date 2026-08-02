import { getCategorias, postCategorias, getCategoriasById, putCategorias, deleteCategorias } from "../services/categorias.service.js";

// Controlador para obtener todas las categorias
export const getCategoriasController = async (req, res) => {
    try {
        const categorias = await getCategorias();
        res.json(categorias);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getCategoriasByIdController = async (req, res) => {
    try {
        const { id } = req.params;
        const categoria = await getCategoriasById(id);
        res.json(categoria);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const postCategoriasController = async (req, res) => {
    try {
        const categoriaData = req.body;
        const newCategoria = await postCategorias(categoriaData);
        res.status(201).json(newCategoria);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const putCategoriasController = async (req, res) => {
    try {
        const { id } = req.params;
        const categoriaData = req.body;
        const updatedCategoria = await putCategorias(id, categoriaData);
        res.json(updatedCategoria);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const deleteCategoriasController = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedCategoria = await deleteCategorias(id);
        res.json(deletedCategoria);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
