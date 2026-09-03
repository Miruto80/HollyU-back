import {
  Cotizaciones,
  Clientes,
  Estados_cotizacion,
  Detalle_cotizacion,
  Productos
} from '../models/index.js';

export const getCotizaciones = async () => {
  return Cotizaciones.findAll({
    include: [
      { model: Clientes, attributes: ['id', 'nombres', 'apellidos', 'email'] },
      { model: Estados_cotizacion, attributes: ['id', 'nombre'] },
      {
        model: Detalle_cotizacion,
        attributes: ['id', 'cantidad', 'precio'],
        include: [{ model: Productos, attributes: ['id', 'codigo', 'nombre'] }]
      }
    ],
    order: [['fecha', 'DESC']]
  });
};
