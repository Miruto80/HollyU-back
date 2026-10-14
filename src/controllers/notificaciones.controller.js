import {
  getHistorialNotificaciones,
  getNotificacionesPendientes,
  marcarNotificacionesEnviadas,
  TIPOS_NOTIFICACION
} from '../services/notificaciones.service.js';

export const getHistorialNotificacionesController = async (_req, res) => {
  try {
    const notificaciones = await getHistorialNotificaciones();
    res.json(notificaciones);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getNotificacionesPendientesController = async (req, res) => {
  const { tipo } = req.query;
  if (!Object.values(TIPOS_NOTIFICACION).includes(tipo)) {
    return res.status(400).json({ message: 'El tipo de notificación no es válido' });
  }

  try {
    const notificaciones = await getNotificacionesPendientes(tipo);
    res.json(notificaciones);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const marcarNotificacionesEnviadasController = async (req, res) => {
  const { ids } = req.body;
  if (!Array.isArray(ids) || ids.length === 0 || ids.some((id) => !Number.isInteger(Number(id)) || Number(id) <= 0)) {
    return res.status(400).json({ message: 'Se requiere una lista válida de ids' });
  }

  try {
    const actualizadas = await marcarNotificacionesEnviadas(ids.map(Number));
    res.json({ actualizadas });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
