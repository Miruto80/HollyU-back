import { DataTypes } from 'sequelize';
import sequelize from '../database/db.js';

export const Tallas = sequelize.define('Tallas', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  nombre: { type: DataTypes.STRING(20), allowNull: false, unique: true }
}, { tableName: 'tallas', timestamps: false });

export const associateTallas = () => {
  const { Producto_variantes, Producto_tallas, Productos } = sequelize.models;

  Tallas.hasMany(Producto_variantes, { foreignKey: 'talla_id' });
  Producto_variantes.belongsTo(Tallas, { foreignKey: 'talla_id' });

  Tallas.belongsToMany(Productos, {
    through: Producto_tallas,
    foreignKey: 'talla_id',
    otherKey: 'producto_id'
  });
};
