import { Descuentos, Tipos_descuento, Productos, Categorias } from '../models/index.js';

const includeRelations = [
  { model: Tipos_descuento, attributes: ['id', 'nombre'] },
  { model: Categorias, attributes: ['id', 'nombre'] },
  { model: Productos, attributes: ['id', 'nombre'], through: { attributes: [] } }
];

export const getDescuentos = async () => {
  try {
    return await Descuentos.findAll({
      include: includeRelations,
      order: [['id', 'DESC']]
    });
  } catch (error) {
    throw new Error('Error al obtener los descuentos');
  }
};

export const getDescuentoById = async (id) => {
  try {
    return await Descuentos.findByPk(id, { include: includeRelations });
  } catch (error) {
    throw new Error('Error al obtener el descuento');
  }
};

export const postDescuento = async (descuentoData) => {
  try {
    const { productos = [], categoria_id, ...rest } = descuentoData;

    const payload = {
      ...rest,
      categoria_id: categoria_id ? Number(categoria_id) : null
    };

    const descuento = await Descuentos.create(payload);

    if (Array.isArray(productos) && productos.length > 0) {
      await descuento.setProductos(productos.map((id) => Number(id)));
    }

    return await getDescuentoById(descuento.id);
  } catch (error) {
    throw new Error(error.message || 'Error al crear el descuento');
  }
};

export const putDescuento = async (id, descuentoData) => {
  try {
    const descuento = await Descuentos.findByPk(id);
    if (!descuento) {
      throw new Error('Descuento no encontrado');
    }

    const { productos = [], categoria_id, ...rest } = descuentoData;

    await descuento.update({
      ...rest,
      categoria_id: categoria_id ? Number(categoria_id) : null
    });

    if (Array.isArray(productos)) {
      await descuento.setProductos(productos.map((productoId) => Number(productoId)));
    }

    return await getDescuentoById(id);
  } catch (error) {
    throw new Error(error.message || 'Error al actualizar el descuento');
  }
};

export const deleteDescuento = async (id) => {
  try {
    const descuento = await Descuentos.findByPk(id);
    if (!descuento) {
      throw new Error('Descuento no encontrado');
    }

    await descuento.destroy();
    return descuento;
  } catch (error) {
    throw new Error('Error al eliminar el descuento');
  }
};
