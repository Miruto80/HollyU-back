import { Modelos } from "../models/index.js";

export const getModelos = async () => {
    try {
        const modelos = await Modelos.findAll();
        return modelos;
    } catch (error) {
        throw new Error("Error al obtener los Modelos");
    }
};