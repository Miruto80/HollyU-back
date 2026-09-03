import { DataTypes } from 'sequelize';
import sequelize from '../database/db.js';

export const Producto_imagenes = sequelize.define('Producto_imagenes', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  producto_id: { type: DataTypes.INTEGER, allowNull: true },
  imagen: { type: DataTypes.TEXT, allowNull: false },
  principal: { type: DataTypes.BOOLEAN, defaultValue: false },
  orden: { type: DataTypes.INTEGER, defaultValue: 1 },
  created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
}, { tableName: 'producto_imagenes', timestamps: false });

export const associateProducto_imagenes = () => {
  const { Productos } = sequelize.models;

  Producto_imagenes.belongsTo(Productos, { foreignKey: 'producto_id' });
  Productos.hasMany(Producto_imagenes, { foreignKey: 'producto_id' });

};
