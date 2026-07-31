import { Tipos_tela } from "../models/index.js";

export const getTipos_tela = async () => {
    try {
        const tipos_tela = await Tipos_tela.findAll();
        return tipos_tela;
    } catch (error) {
        throw new Error("Error al obtener los Tipos_tela");
    }
};