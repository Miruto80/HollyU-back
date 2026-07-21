import { DataTypes } from 'sequelize';
import sequelize from '../database/db.js';

export const Generos = sequelize.define('Generos', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  nombre: { type: DataTypes.STRING(40), allowNull: false, unique: true }
}, { tableName: 'generos', timestamps: false });

export const associateGeneros = () => {
  const { Productos } = sequelize.models;

  Generos.hasMany(Productos, { foreignKey: 'genero_id' });
  Productos.belongsTo(Generos, { foreignKey: 'genero_id' });
};
