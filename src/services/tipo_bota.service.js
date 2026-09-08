import { Tipo_bota } from "../models/index.js";

export const getTipos_bota = async () => {
  try {
    return await Tipo_bota.findAll({
      where: { activo: true },
      order: [['nombre', 'ASC']]
    });
  } catch (error) {
    throw new Error("Error al obtener los tipos de bota");
  }
};
