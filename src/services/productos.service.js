import { Productos, Producto_imagenes } from '../models/index.js';

export const getProductos = async () => {
  try {
    return await Productos.findAll({
      include: [{ model: Producto_imagenes }]
    });
  } catch (error) {
    console.error(error);
    throw error;
  }
};