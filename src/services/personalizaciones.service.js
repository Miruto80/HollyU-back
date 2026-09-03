import fs from 'fs';
import path from 'path';
import { Clientes, Productos, Personalizaciones } from '../models/index.js';

export const postPersonalizacion = async (payload) => {
  const { cliente_id, producto_id, descripcion_solicitada, observaciones, archivo } = payload;

  if (!cliente_id || !producto_id) {
    throw new Error('cliente_id y producto_id son requeridos');
  }
  if (!descripcion_solicitada || !descripcion_solicitada.trim()) {
    throw new Error('La descripción de la personalización es requerida');
  }

  const [cliente, producto] = await Promise.all([
    Clientes.findByPk(cliente_id),
    Productos.findByPk(producto_id)
  ]);

  if (!cliente) throw new Error('Cliente no encontrado');
  if (!producto) throw new Error('Producto no encontrado');
  if (!producto.permite_personalizacion) {
    throw new Error('Este producto no permite personalización');
  }

  let imagenReferencia = null;
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