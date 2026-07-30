import { 
  Productos, 
  Producto_imagenes, 
  Colores, 
  Tallas 
} from '../models/index.js';

export const getProductos = async () => {
  try {
    return await Productos.findAll({
      include: [
        {
          model: Producto_imagenes
        },
        {
          model: Colores,
          through: {
            attributes: []
          }
        },
        {
          model: Tallas,
          through: {
            attributes: []
          }
        }
      ]
    });

  } catch (error) {
    console.error(error);
    throw error;
  }
};