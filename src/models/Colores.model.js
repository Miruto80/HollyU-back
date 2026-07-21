import { DataTypes } from 'sequelize';
import sequelize from '../database/db.js';

export const Colores = sequelize.define('Colores', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  nombre: { type: DataTypes.STRING(50), allowNull: false, unique: true },
  codigo_hex: { type: DataTypes.STRING(7) }
}, { tableName: 'colores', timestamps: false });

export const associateColores = () => {
  const { Producto_variantes } = sequelize.models;

  Colores.hasMany(Producto_variantes, { foreignKey: 'color_id' });
  Producto_variantes.belongsTo(Colores, { foreignKey: 'color_id' });
};
