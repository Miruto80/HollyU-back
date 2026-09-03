import { getCotizaciones } from '../services/cotizaciones.service.js';

export const getCotizacionesController = async (req, res) => {
  try {
    const cotizaciones = await getCotizaciones();
    res.status(200).json(cotizaciones);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
