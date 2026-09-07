import {
  getCotizaciones,
  pasarCotizacionAProduccion
} from '../services/cotizaciones.service.js';

export const getCotizacionesController = async (req, res) => {
  try {
    const cotizaciones = await getCotizaciones();
    res.status(200).json(cotizaciones);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const pasarCotizacionAProduccionController = async (req, res) => {
  try {
    const cotizacion = await pasarCotizacionAProduccion(req.params.id);
    res.json(cotizacion);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
