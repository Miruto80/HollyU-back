import fs from 'fs';
import { postPersonalizacion } from '../services/personalizaciones.service.js';

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