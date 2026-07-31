import { Categorias } from "../models/index.js";

export const getCategorias = async () => {
    try {
        const categorias = await Categorias.findAll();
        return categorias;
    } catch (error) {
        throw new Error("Error al obtener los categorias");
    }
};