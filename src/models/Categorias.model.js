import { DataTypes } from 'sequelize';
import sequelize from '../database/db.js';

export const Categorias = sequelize.define('Categorias', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  nombre: { type: DataTypes.STRING(80), allowNull: false, unique: true },
  descripcion: { type: DataTypes.TEXT },
  activo: { type: DataTypes.BOOLEAN, defaultValue: true }
}, { tableName: 'categorias', timestamps: false });

export const associateCategorias = () => {
  const { Productos } = sequelize.models;

  Categorias.hasMany(Productos, { foreignKey: 'categoria_id' });
  Productos.belongsTo(Categorias, { foreignKey: 'categoria_id' });
};
