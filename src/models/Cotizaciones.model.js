import { DataTypes } from 'sequelize';
import sequelize from '../database/db.js';

export const Cotizaciones = sequelize.define('Cotizaciones', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  cliente_id: { type: DataTypes.INTEGER, allowNull: false },
  estado_cotizacion_id: { type: DataTypes.INTEGER, allowNull: false },
  subtotal: { type: DataTypes.DECIMAL(12, 2), defaultValue: 0 },
  descuento: { type: DataTypes.DECIMAL(12, 2), defaultValue: 0 },
  total: { type: DataTypes.DECIMAL(12, 2), defaultValue: 0 },
  observaciones: { type: DataTypes.TEXT },
  fecha: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
}, { tableName: 'cotizaciones', timestamps: false });

export const associateCotizaciones = () => {
  const { Clientes, Estados_cotizacion, Detalle_cotizacion } = sequelize.models;

  Cotizaciones.belongsTo(Clientes, { foreignKey: 'cliente_id' });
  Clientes.hasMany(Cotizaciones, { foreignKey: 'cliente_id' });

  Cotizaciones.belongsTo(Estados_cotizacion, { foreignKey: 'estado_cotizacion_id' });
  Estados_cotizacion.hasMany(Cotizaciones, { foreignKey: 'estado_cotizacion_id' });

  Cotizaciones.hasMany(Detalle_cotizacion, { foreignKey: 'cotizacion_id' });
  Detalle_cotizacion.belongsTo(Cotizaciones, { foreignKey: 'cotizacion_id' });
};
