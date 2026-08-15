import path from 'path';
import fs from 'fs';
import sequelize from '../database/db.js';


import { 
  Productos,
  Producto_imagenes,
  Modelos,
  Modelo_telas,
  Modelo_telas_colores,
  Modelo_tallas,
  Tipos_tela,
  Colores,
  Tallas,
  Categorias,
  Generos
} from '../models/index.js';

export const getProductos = async (filters = {}) => {
  try {
    const where = {};

    if (filters.categoria_id) {
      where.categoria_id = filters.categoria_id;
    }

    if (filters.genero_id) {
      where.genero_id = filters.genero_id;
    }

    if (filters.activo !== undefined) {
      where.activo = filters.activo === 'true' || filters.activo === true;
    }

     return await Productos.findAll({
      attributes: [
        'id', 'codigo', 'nombre', 'activo', 'precio', 'precio_mayor',
        'permite_personalizacion', 'tiempo_fabricacion', 'created_at'
      ],
      include: [
        { model: Categorias, attributes: ['id', 'nombre'] },
        { model: Generos, attributes: ['id', 'nombre'] },
        {
          model: Producto_imagenes,
          attributes: ['imagen'],
          where: { principal: true },
          required: false
        }
      ]
    });
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const getProductoById = async (id) => {
  try {
    return await Productos.findByPk(id, {
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
                      as: 'color'
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

export const postProducto = async (payload) => {
  const t = await sequelize.transaction();

  try {
     const {
      codigo, nombre, descripcion, categoria_id, genero_id,
      precio, precio_mayor,
      permite_personalizacion, tiempo_fabricacion,
      modelos, archivo
    } = payload;

    const producto = await Productos.create({
      codigo, nombre, descripcion, categoria_id, genero_id,
      precio, precio_mayor,
      permite_personalizacion: permite_personalizacion === 'true' || permite_personalizacion === true,
      tiempo_fabricacion
    }, { transaction: t });

    if (archivo) {
      const destFolder = path.join('uploads', 'products');
      if (!fs.existsSync(destFolder)) {
        fs.mkdirSync(destFolder, { recursive: true });
      }

      const destPath = path.join(destFolder, archivo.filename);
      fs.renameSync(archivo.path, destPath);

      await Producto_imagenes.create({
        producto_id: producto.id,
        imagen: `/uploads/products/${archivo.filename}`,
        principal: true,
        orden: 1
      }, { transaction: t });
    }

   for (const m of modelos) {
      const modelo = await Modelos.create({
        producto_id: producto.id,
        nombre: m.nombre,
        descripcion: m.descripcion
      }, { transaction: t });

      for (const tela of m.telas) {
        const modeloTela = await Modelo_telas.create({
          modelo_id: modelo.id,
          tipo_tela_id: tela.tipo_tela_id
        }, { transaction: t });

        for (const colorId of tela.colores) {
          await Modelo_telas_colores.create({
            modelo_tela_id: modeloTela.id,
            color_id: colorId
          }, { transaction: t });
        }
      }

      for (const tallaId of m.tallas) {
        await Modelo_tallas.create({
          modelo_id: modelo.id,
          talla_id: tallaId
        }, { transaction: t });
      }
    }

    await t.commit();
    return getProductoById(producto.id);

  } catch (error) {
    await t.rollback();
    if (payload.archivo) fs.unlink(payload.archivo.path, () => {});
    console.error(error);
    throw error;
  }
};