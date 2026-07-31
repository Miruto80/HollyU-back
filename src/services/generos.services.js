import { Generos } from "../models/index.js";

export const getGeneros = async () => {
    try {
        const generos = await Generos.findAll();
        return generos;
    } catch (error) {
        throw new Error("Error al obtener los Generos");
    }
};