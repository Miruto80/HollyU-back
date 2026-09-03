import fs from 'fs';
import {
  cotizarPersonalizacion,
  getPersonalizaciones,
  postPersonalizacion,
  rechazarPersonalizacion
} from '../services/personalizaciones.service.js';

export const getPersonalizacionesController = async (req, res) => {
  try {
    const personalizaciones = await getPersonalizaciones(req.query);
    res.status(200).json(personalizaciones);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const postPersonalizacionController = async (req, res) => {
  try {
    const personalizacion = await postPersonalizacion({
      ...req.body,
      archivo: req.file
    });
    res.status(201).json(personalizacion);
  } catch (error) {
    if (req.file) fs.unlink(req.file.path, () => {});
    res.status(400).json({ message: error.message });
  }
};

export const cotizarPersonalizacionController = async (req, res) => {
  try {
    const personalizacion = await cotizarPersonalizacion(req.params.id, req.body);
    res.status(201).json(personalizacion);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const rechazarPersonalizacionController = async (req, res) => {
  try {
    const personalizacion = await rechazarPersonalizacion(req.params.id, req.body.respuesta_admin);
    res.json(personalizacion);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};