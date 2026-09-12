import { Metodos_pago } from "../models/index.js";

export const getMetodos_pago = async () => {
  try {
    return await Metodos_pago.findAll();
  } catch (error) {
    throw new Error("Error al obtener los métodos de pago");
  }
};