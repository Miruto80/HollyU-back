import { Tallas } from "../models/index.js";

export const getTallas = async () => {
    try {
        const tallas = await Tallas.findAll();
        return tallas;
    } catch (error) {
        throw new Error("Error al obtener los tallas");
    }
};