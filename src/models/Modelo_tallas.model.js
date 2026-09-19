import { DataTypes } from 'sequelize';
import sequelize from '../database/db.js';

export const Modelo_tallas = sequelize.define('Modelo_tallas', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  producto_modelo_id: { type: DataTypes.INTEGER, allowNull: false }, // antes: modelo_id
  talla_id: { type: DataTypes.INTEGER, allowNull: false }
}, { tableName: 'modelo_tallas', timestamps: false });

export const associateModelo_tallas = () => {
  const { Tallas } = sequelize.models;

  Modelo_tallas.belongsTo(Tallas, { foreignKey: 'talla_id' });
  Tallas.hasMany(Modelo_tallas, { foreignKey: 'talla_id' });
};