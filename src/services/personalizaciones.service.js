import fs from 'fs';
import path from 'path';
import {
  Clientes,
  Cotizaciones,
  Detalle_cotizacion,
  Estados_cotizacion,
  Personalizaciones,
  Productos,
  Producto_imagenes
} from '../models/index.js';


export const getPersonalizaciones = async (filters = {}) => {
  try {
    const where = {};
    if (filters.cliente_id) {
      where.cliente_id = filters.cliente_id;
    }
    if (filters.producto_id) {
      where.producto_id = filters.producto_id;
    }
    if (filters.estado) {
      where.estado = filters.estado;
    }

    return await Personalizaciones.findAll({
      where,
      include: [
        { model: Clientes, attributes: ['id', 'nombres', 'apellidos', 'email'] },
        {
          model: Productos,
          attributes: ['id', 'codigo', 'nombre', 'precio'],
          include: [{ model: Producto_imagenes, attributes: ['imagen'] }]
        }
      ],
      order: [['id', 'DESC']]
    });
  } catch (error) {
    throw error;
  }
};

export const postPersonalizacion = async (payload) => {
  const {
    cliente_id,
    producto_id,
    descripcion_solicitada,
    observaciones,
    imagen_referencia,
    archivo
  } = payload;

  if (!cliente_id) {
    throw new Error('cliente_id es requerido');
  }
  if (!descripcion_solicitada || !descripcion_solicitada.trim()) {
    throw new Error('La descripción de la personalización es requerida');
  }

  const cliente = await Clientes.findByPk(cliente_id);
  const producto = producto_id ? await Productos.findByPk(producto_id) : null;

  if (!cliente) throw new Error('Cliente no encontrado');
  if (producto_id && !producto) throw new Error('Producto no encontrado');
  if (producto && !producto.permite_personalizacion) {
    throw new Error('Este producto no permite personalización');
  }

  let imagenReferencia = imagen_referencia || null;
  if (archivo) {
    const destFolder = path.join('uploads', 'personalizaciones');
    fs.mkdirSync(destFolder, { recursive: true });
    const destPath = path.join(destFolder, archivo.filename);
    fs.renameSync(archivo.path, destPath);
    imagenReferencia = `/uploads/personalizaciones/${archivo.filename}`;
  }

  try {
    return await Personalizaciones.create({
      cliente_id,
      producto_id,
      descripcion_solicitada: descripcion_solicitada.trim(),
      imagen_referencia: imagenReferencia,
      observaciones,
      estado: 'pendiente_aprobacion'
    });
  } catch (error) {
    if (archivo) fs.unlink(path.join('uploads', 'personalizaciones', archivo.filename), () => {});
    throw error;
  }
};

export const cotizarPersonalizacion = async (id, payload = {}) => {
  const precio = Number(payload.precio);
  if (!Number.isFinite(precio) || precio <= 0) {
    throw new Error('El precio de la cotización debe ser mayor que cero');
  }

  const personalizacion = await Personalizaciones.findByPk(id);
  if (!personalizacion) throw new Error('Personalización no encontrada');
  if (personalizacion.estado === 'rechazada') {
    throw new Error('No se puede cotizar una personalización rechazada');
  }
  if (personalizacion.cotizacion_id) {
    throw new Error('Esta personalización ya tiene una cotización');
  }

  const estado = await Estados_cotizacion.findOrCreate({
    where: { nombre: 'Pendiente' }
  }).then(([record]) => record);

  const cotizacion = await Cotizaciones.create({
    cliente_id: personalizacion.cliente_id,
    estado_cotizacion_id: estado.id,
    subtotal: precio,
    descuento: 0,
    total: precio,
    observaciones: payload.observaciones || `Personalización #${personalizacion.id}`
  });

  if (personalizacion.producto_id) {
    await Detalle_cotizacion.create({
      cotizacion_id: cotizacion.id,
      producto_id: personalizacion.producto_id,
      cantidad: 1,
      precio
    });
  }

  await personalizacion.update({
    estado: 'cotizada',
    precio_cotizado: precio,
    cotizacion_id: cotizacion.id,
    respuesta_admin: payload.observaciones || null,
    fecha_aprobacion: new Date(),
    fecha_cotizacion: new Date()
  });

  return personalizacion;
};

export const rechazarPersonalizacion = async (id, respuesta_admin) => {
  const personalizacion = await Personalizaciones.findByPk(id);
  if (!personalizacion) throw new Error('Personalización no encontrada');
  if (personalizacion.cotizacion_id) {
    throw new Error('No se puede rechazar una personalización ya cotizada');
  }

  await personalizacion.update({
    estado: 'rechazada',
    respuesta_admin: respuesta_admin || null,
    fecha_aprobacion: new Date()
  });

  return personalizacion;
};