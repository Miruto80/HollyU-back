import { Notificaciones } from '../models/index.js';

export const TIPOS_NOTIFICACION = {
  PEDIDO_WEB: 'pedido_web',
  PERSONALIZACION: 'personalizaciones',
  PRODUCCION: 'producciones'
};

export const crearNotificacion = (payload, options = {}) =>
  Notificaciones.create(payload, options);

export const getNotificacionesPendientes = (tipo) =>
  Notificaciones.findAll({
    where: { tipo, enviado: false },
    order: [['fecha', 'ASC']],
    limit: 50
  });

export const getHistorialNotificaciones = () =>
  Notificaciones.findAll({
    order: [['fecha', 'DESC']]
  });

export const marcarNotificacionesEnviadas = async (ids) => {
  const [actualizadas] = await Notificaciones.update(
    { enviado: true },
    { where: { id: ids, enviado: false } }
  );

  return actualizadas;
};
