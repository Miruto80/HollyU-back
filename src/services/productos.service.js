import path from 'path';
import fs from 'fs';
import { Op } from 'sequelize';
import sequelize from '../database/db.js';

import { 
  Productos,
  Producto_imagenes,
  Modelos,
  Producto_modelos,
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
  model: Producto_modelos,
  include: [
    { model: Modelos, attributes: ['id', 'nombre'] },
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

const resolverModeloId = async (nombreOModeloId, t) => {
  if (typeof nombreOModeloId === 'number' || /^\d+$/.test(nombreOModeloId)) {
    return Number(nombreOModeloId);
  }

  const [modelo] = await Modelos.findOrCreate({
    where: { nombre: nombreOModeloId },
    transaction: t
  });
  return modelo.id;
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
  const modeloId = await resolverModeloId(m.modelo, t);

  const productoModelo = await Producto_modelos.create({
    producto_id: producto.id,
    modelo_id: modeloId
  }, { transaction: t });

  for (const tela of m.telas) {
    const modeloTela = await Modelo_telas.create({
      producto_modelo_id: productoModelo.id,
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
      producto_modelo_id: productoModelo.id,
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
      modelos,
      archivos
    } = payload;

    // Actualizar datos básicos
    await producto.update({
      nombre, descripcion, categoria_id, genero_id,
      precio, precio_mayor, stock,
      permite_personalizacion: permite_personalizacion === 'true' || permite_personalizacion === true,
      tiempo_fabricacion,
      updated_at: new Date()
    }, { transaction: t });

    // Actualizar tipos de bota
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
      // Buscar modelos existentes del producto
      const productoModelosExistentes = await Producto_modelos.findAll({
        where: { producto_id: id },
        attributes: ['id'],
        transaction: t
      });
      const pmIds = productoModelosExistentes.map(pm => pm.id);

      if (pmIds.length > 0) {
        // Verificar si hay pedidos asociados
        const pedidosAsociados = await Detalle_pedido.count({
          where: { producto_modelo_id: pmIds },
          transaction: t
        });

        if (pedidosAsociados > 0) {
          throw new Error(
            'No se puede editar la estructura de modelos/telas/tallas porque este producto ya tiene pedidos asociados. Desactiva el producto y crea uno nuevo en su lugar.'
          );
        }

        // Borrar estructura anterior
        const telasExistentes = await Modelo_telas.findAll({
          where: { producto_modelo_id: pmIds },
          attributes: ['id'],
          transaction: t
        });
        const telaIds = telasExistentes.map(t => t.id);

        if (telaIds.length > 0) {
          await Modelo_telas_colores.destroy({ where: { modelo_tela_id: telaIds }, transaction: t });
        }

        await Modelo_tallas.destroy({ where: { producto_modelo_id: pmIds }, transaction: t });
        await Modelo_telas.destroy({ where: { producto_modelo_id: pmIds }, transaction: t });
        await Producto_modelos.destroy({ where: { producto_id: id }, transaction: t });
      }

      // Crear nueva estructura
      for (const m of modelos) {
        const modeloId = await resolverModeloId(m.modelo, t);

        const productoModelo = await Producto_modelos.create({
          producto_id: id,
          modelo_id: modeloId
        }, { transaction: t });

        // Telas
        for (const tela of m.telas) {
          const modeloTela = await Modelo_telas.create({
            producto_modelo_id: productoModelo.id,
            tipo_tela_id: tela.tipo_tela_id
          }, { transaction: t });

          for (const colorId of tela.colores) {
            await Modelo_telas_colores.create({
              modelo_tela_id: modeloTela.id,
              color_id: colorId
            }, { transaction: t });
          }
        }

        // Tallas
        for (const tallaId of m.tallas) {
          await Modelo_tallas.create({
            producto_modelo_id: productoModelo.id,
            talla_id: tallaId
          }, { transaction: t });
        }
      }
    }

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

export const getProductosMasVendidos = async (limit = 6) => {
  try {
    const masVendidos = await Detalle_pedido.findAll({
      attributes: [
        'producto_id',
        [sequelize.fn('SUM', sequelize.col('cantidad')), 'total_vendido']
      ],
      where: { producto_id: { [Op.ne]: null } }, // excluye líneas personalizadas sin producto_id
      group: ['producto_id'],
      order: [[sequelize.fn('SUM', sequelize.col('cantidad')), 'DESC']],
      limit,
      raw: true
    });

    const productoIds = masVendidos.map(r => r.producto_id);
    if (productoIds.length === 0) return [];

    const productos = await Productos.findAll({
      where: { id: productoIds, estatus: 1 },
      include: [
        { model: Categorias, attributes: ['id', 'nombre'] },
        {
          model: Producto_imagenes,
          attributes: ['imagen'],
          where: { principal: true },
          required: false
        }
      ]
    });

    const productosOrdenados = productoIds
      .map(id => productos.find(p => p.id === id))
      .filter(Boolean);

    return productosOrdenados;
  } catch (error) {
    console.error('Error fetching productos mas vendidos:', error);
    throw error;
  }
};