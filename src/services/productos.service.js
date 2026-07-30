import { 
  Productos,
  Producto_imagenes,
  Modelos,
  Modelo_telas,
  Modelo_telas_colores,
  Modelo_tallas,
  Tipos_tela,
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
          model: Modelos,

          include: [

            {
              model: Modelo_telas,

              include: [
                {
                  model: Tipos_tela
                },
                {
                  model: Modelo_telas_colores,

                  include: [
                    {
                      model: Colores,
                      as:'color'
                    }
                  ]
                }
              ]

            },

            {
              model: Modelo_tallas,

              include: [
                {
                  model: Tallas
                }
              ]

            }

          ]

        }

      ]

    });

  } catch (error) {
    console.error(error);
    throw error;
  }
};