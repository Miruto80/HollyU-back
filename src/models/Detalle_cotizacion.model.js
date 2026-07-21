import { DataTypes } from 'sequelize';
import sequelize from '../database/db.js';

export const Detalle_cotizacion = sequelize.define('Detalle_cotizacion', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  cotizacion_id: { type: DataTypes.INTEGER, allowNull: false },
  producto_id: { type: DataTypes.INTEGER, allowNull: false },
  cantidad: { type: DataTypes.INTEGER, allowNull: false },
  precio: { type: DataTypes.DECIMAL(12, 2) }
}, { tableName: 'detalle_cotizacion', timestamps: false });

export const associateDetalle_cotizacion = () => {
  const { Cotizaciones, Productos } = sequelize.models;

  Detalle_cotizacion.belongsTo(Cotizaciones, { foreignKey: 'cotizacion_id' });
  Cotizaciones.hasMany(Detalle_cotizacion, { foreignKey: 'cotizacion_id' });

  Detalle_cotizacion.belongsTo(Productos, { foreignKey: 'producto_id' });
  Productos.hasMany(Detalle_cotizacion, { foreignKey: 'producto_id' });
};
