import { DataTypes } from 'sequelize';
import sequelize from '../database/db.js';

export const Estados_cotizacion = sequelize.define('Estados_cotizacion', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  nombre: { type: DataTypes.STRING(50), allowNull: false, unique: true }
}, { tableName: 'estados_cotizacion', timestamps: false });

export const associateEstados_cotizacion = () => {
  const { Cotizaciones } = sequelize.models;

  Estados_cotizacion.hasMany(Cotizaciones, { foreignKey: 'estado_cotizacion_id' });
  Cotizaciones.belongsTo(Estados_cotizacion, { foreignKey: 'estado_cotizacion_id' });
};
