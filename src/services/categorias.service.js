import { Categorias } from "../models/index.js";

export const getCategorias = async () => {
    try {
        const categorias = await Categorias.findAll();
        return categorias;
    } catch (error) {
        throw new Error("Error al obtener los categorias");
    }
};

export const getCategoriasById = async (id) => {
    try {
        const categoria = await Categorias.findByPk(id);
        return categoria;
    } catch (error) {
        throw new Error("Error al obtener la categoria");
    }
};

export const postCategorias = async (categoriaData) => {
    try {
        const categoria = await Categorias.create(categoriaData);
        return categoria;
    } catch (error) {
        throw new Error("Error al crear la categoria");
    }     
}

export const putCategorias = async (id, categoriaData) => {
    try {
        const categoria = await Categorias.findByPk(id);
        if (!categoria) {
            throw new Error("Categoria no encontrada");
        }
        await categoria.update(categoriaData);
        return categoria;
    } catch (error) {
        throw new Error("Error al actualizar la categoria");
    }
};

export const deleteCategorias = async (id) => {
    try {
        const categoria = await Categorias.findByPk(id);
        if (!categoria) {
            throw new Error("Categoria no encontrada");
        }
        await categoria.destroy();
        return categoria;
    } catch (error) {
        throw new Error("Error al eliminar la categoria");
    }
};
