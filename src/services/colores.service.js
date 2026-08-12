import {Colores} from "../models/index.js";

// Obtener todos los colores
export const getColores = async () => {
    try {
        const colores = await Colores.findAll();
        return colores;
    } catch (error) {
        throw new Error("Error al obtener los colores");
    }
};

export const postColores = async (coloresData) => {
    try {
        const colores = await Colores.create(coloresData);
        return colores;
    } catch (error) {
        throw new Error("Error al crear el color");
    }     
}