import path from 'path';
import fs from 'fs';
import { Op } from 'sequelize';
import sequelize from '../database/db.js';

import { 
  Productos,
  Producto_imagenes,
  Modelos,
  Modelo_telas,
  Modelo_telas_colores,
  Modelo_tallas,
  Detalle_pedido,
  Tipos_tela,
  Colores,
  Tallas,
  Categorias,
  Generos,
  Tipo_bota,
  Producto_tipo_bota
} from '../models/index.js';

const ESTATUS_ELIMINADO = 0;
const ESTATUS_ACTIVO = 1;
const ESTATUS_DESACTIVADO = 2;

export const getProductos = async (filters = {}) => {
  try {
    const where = { estatus: { [Op.ne]: ESTATUS_ELIMINADO } }; // nunca mostrar eliminados

    if (filters.categoria_id) where.categoria_id = filters.categoria_id;
    if (filters.genero_id) where.genero_id = filters.genero_id;
    if (filters.estatus !== undefined) where.estatus = Number(filters.estatus);

    return await Productos.findAll({
      where,
      attributes: [
        'id', 'tipo_bota_id', 'nombre', 'estatus', 'precio', 'precio_mayor', 'stock',
        'permite_personalizacion', 'tiempo_fabricacion', 'created_at'
      ],
      include: [
        { model: Categorias, attributes: ['id', 'nombre'] },
        { model: Generos, attributes: ['id', 'nombre'] },
        { model: Tipo_bota, attributes: ['id', 'nombre'], required: false },
        { model: Tipo_bota, as: 'Tipos_bota', attributes: ['id', 'nombre'], through: { attributes: [] } },
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
        { model: Categorias, attributes: ['id', 'nombre'] },
        { model: Generos, attributes: ['id', 'nombre'] },
        {
          model: Tipo_bota,
          as: 'Tipos_bota',
          attributes: ['id', 'nombre'],
          through: { attributes: [] }
        },
      {
  model: Producto_imagenes,
  separate: true,
  order: [['orden', 'ASC']]
},
        {
          model: Modelos,
          include: [
            {
              model: Modelo_telas,
              include: [
                { model: Tipos_tela },
                {
                  model: Modelo_telas_colores,
                  include: [{ model: Colores, as: 'color' }]
                }
              ]
            },
            {
              model: Modelo_tallas,
              include: [{ model: Tallas }]
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
      nombre, descripcion, categoria_id, genero_id, tipo_bota_id, tipo_bota_ids,
      precio, precio_mayor, stock,
      permite_personalizacion, tiempo_fabricacion,
      modelos, archivos
    } = payload;

    const producto = await Productos.create({
      nombre, descripcion, categoria_id, genero_id, tipo_bota_id,
      precio, precio_mayor, stock: stock || 0,
      permite_personalizacion: permite_personalizacion === 'true' || permite_personalizacion === true,
      tiempo_fabricacion,
      estatus: ESTATUS_ACTIVO
    }, { transaction: t });

    const tiposBota = tipo_bota_ids?.length ? tipo_bota_ids : (tipo_bota_id ? [tipo_bota_id] : []);
    for (const tipoBotaId of tiposBota) {
      await Producto_tipo_bota.create({
        producto_id: producto.id,
        tipo_bota_id: tipoBotaId
      }, { transaction: t });
    }

    if (archivos && archivos.length > 0) {
      const destFolder = path.join('uploads', 'products');
      if (!fs.existsSync(destFolder)) {
        fs.mkdirSync(destFolder, { recursive: true });
      }

      for (let i = 0; i < archivos.length; i++) {
        const archivo = archivos[i];
        const destPath = path.join(destFolder, archivo.filename);
        fs.renameSync(archivo.path, destPath);

        await Producto_imagenes.create({
          producto_id: producto.id,
          imagen: `/uploads/products/${archivo.filename}`,
          principal: i === 0,
          orden: i + 1
        }, { transaction: t });
      }
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
    if (payload.archivos) {
      payload.archivos.forEach(a => fs.unlink(a.path, () => {}));
    }
    console.error(error);
    throw error;
  }
};

export const putProducto = async (id, payload) => {
  const t = await sequelize.transaction();

  try {
    const producto = await Productos.findByPk(id, { transaction: t });
    if (!producto) throw new Error('Producto no encontrado');

    const {
      nombre, descripcion, categoria_id, genero_id,
      tipo_bota_ids,
      precio, precio_mayor, stock,
      permite_personalizacion, tiempo_fabricacion,
      modelos, // opcional: si viene, reemplaza toda la estructura
      archivos
    } = payload;

    await producto.update({
      nombre, descripcion, categoria_id, genero_id,
      precio, precio_mayor, stock,
      permite_personalizacion: permite_personalizacion === 'true' || permite_personalizacion === true,
      tiempo_fabricacion,
      updated_at: new Date()
    }, { transaction: t });

    if (tipo_bota_ids) {
      await Producto_tipo_bota.destroy({ where: { producto_id: id }, transaction: t });
      for (const tipoBotaId of tipo_bota_ids) {
        await Producto_tipo_bota.create({
          producto_id: id,
          tipo_bota_id: tipoBotaId
        }, { transaction: t });
      }
    }

    if (modelos) {
      const modelosExistentes = await Modelos.findAll({
        where: { producto_id: id },
        attributes: ['id'],
        transaction: t
      });
      const modeloIds = modelosExistentes.map(m => m.id);

      if (modeloIds.length > 0) {
        const pedidosAsociados = await Detalle_pedido.count({
          where: { modelo_id: modeloIds },
          transaction: t
        });

        if (pedidosAsociados > 0) {
          throw new Error('No se puede editar la estructura de modelos/telas/tallas porque este producto ya tiene pedidos asociados. Desactiva el producto y crea uno nuevo en su lugar.');
        }

        // Sin pedidos asociados: seguro borrar y recrear
        const telasExistentes = await Modelo_telas.findAll({
          where: { modelo_id: modeloIds },
          attributes: ['id'],
          transaction: t
        });
        const telaIds = telasExistentes.map(t => t.id);

        if (telaIds.length > 0) {
          await Modelo_telas_colores.destroy({ where: { modelo_tela_id: telaIds }, transaction: t });
        }
        await Modelo_tallas.destroy({ where: { modelo_id: modeloIds }, transaction: t });
        await Modelo_telas.destroy({ where: { modelo_id: modeloIds }, transaction: t });
        await Modelos.destroy({ where: { producto_id: id }, transaction: t });
      }

      // Recrear desde cero con los datos nuevos
      for (const m of modelos) {
        const modeloNuevo = await Modelos.create({
          producto_id: id,
          nombre: m.nombre,
          descripcion: m.descripcion
        }, { transaction: t });

        for (const tela of m.telas) {
          const modeloTela = await Modelo_telas.create({
            modelo_id: modeloNuevo.id,
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
            modelo_id: modeloNuevo.id,
            talla_id: tallaId
          }, { transaction: t });
        }
      }
    }

    // Imágenes nuevas: se agregan a las existentes, no las reemplazan
    if (archivos && archivos.length > 0) {
      const destFolder = path.join('uploads', 'products');
      if (!fs.existsSync(destFolder)) {
        fs.mkdirSync(destFolder, { recursive: true });
      }

      const existentes = await Producto_imagenes.count({ where: { producto_id: id }, transaction: t });

      for (let i = 0; i < archivos.length; i++) {
        const archivo = archivos[i];
        const destPath = path.join(destFolder, archivo.filename);
        fs.renameSync(archivo.path, destPath);

        await Producto_imagenes.create({
          producto_id: id,
          imagen: `/uploads/products/${archivo.filename}`,
          principal: existentes === 0 && i === 0,
          orden: existentes + i + 1
        }, { transaction: t });
      }
    }

    await t.commit();
    return getProductoById(id);

  } catch (error) {
    await t.rollback();
    if (payload.archivos) {
      payload.archivos.forEach(a => fs.unlink(a.path, () => {}));
    }
    console.error(error);
    throw error;
  }
};

export const deleteProducto = async (id) => {
  const producto = await Productos.findByPk(id);
  if (!producto) throw new Error('Producto no encontrado');

  await producto.update({ estatus: ESTATUS_ELIMINADO });
  return { message: 'Producto eliminado correctamente' };
};

// Cambiar entre Activo y Desactivado (no toca eliminados)
export const cambiarEstatusProducto = async (id, nuevoEstatus) => {
  const estatusNum = Number(nuevoEstatus);

  if (![ESTATUS_ACTIVO, ESTATUS_DESACTIVADO].includes(estatusNum)) {
    throw new Error('Estatus no válido, solo se permite Activo o Desactivado');
  }

  const producto = await Productos.findByPk(id);
  if (!producto) throw new Error('Producto no encontrado');

  if (producto.estatus === ESTATUS_ELIMINADO) {
    throw new Error('No se puede cambiar el estatus de un producto eliminado');
  }

  await producto.update({ estatus: estatusNum });
  return getProductoById(id);
};

export const eliminarImagenProducto = async (productoId, imagenId) => {
  const imagen = await Producto_imagenes.findOne({
    where: { id: imagenId, producto_id: productoId }
  });
  if (!imagen) throw new Error('Imagen no encontrada');

  const eraPrincipal = imagen.principal;

  // Borrar el archivo físico
  const filePath = path.join(process.cwd(), imagen.imagen);
  fs.unlink(filePath, () => {}); // no bloqueamos si falla, puede que ya no exista

  await imagen.destroy();

  // Si borramos la principal, promovemos otra (la de menor orden) a principal
  if (eraPrincipal) {
    const siguiente = await Producto_imagenes.findOne({
      where: { producto_id: productoId },
      order: [['orden', 'ASC']]
    });
    if (siguiente) {
      await siguiente.update({ principal: true });
    }
  }

  return getProductoById(productoId);
};

export const reemplazarImagenProducto = async (productoId, imagenId, archivo) => {
  const imagen = await Producto_imagenes.findOne({
    where: { id: imagenId, producto_id: productoId }
  });
  if (!imagen) throw new Error('Imagen no encontrada');

  if (!archivo) throw new Error('Debe subir un archivo nuevo');

  const destFolder = path.join('uploads', 'products');
  if (!fs.existsSync(destFolder)) {
    fs.mkdirSync(destFolder, { recursive: true });
  }

  const destPath = path.join(destFolder, archivo.filename);
  fs.renameSync(archivo.path, destPath);

  // Borrar el archivo viejo del disco
  const oldFilePath = path.join(process.cwd(), imagen.imagen);
  fs.unlink(oldFilePath, () => {});

  await imagen.update({
    imagen: `/uploads/products/${archivo.filename}`
  });

  return getProductoById(productoId);
};

export const marcarImagenPrincipal = async (productoId, imagenId) => {
  const imagen = await Producto_imagenes.findOne({
    where: { id: imagenId, producto_id: productoId }
  });
  if (!imagen) throw new Error('Imagen no encontrada');

  await Producto_imagenes.update(
    { principal: false },
    { where: { producto_id: productoId } }
  );
  await imagen.update({ principal: true });

  return getProductoById(productoId);
};