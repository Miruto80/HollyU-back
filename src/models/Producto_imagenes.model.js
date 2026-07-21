import { DataTypes } from 'sequelize';
import sequelize from '../database/db.js';

export const Producto_imagenes = sequelize.define('Producto_imagenes', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  variante_id: { type: DataTypes.INTEGER, allowNull: false },
  imagen: { type: DataTypes.TEXT, allowNull: false },
  principal: { type: DataTypes.BOOLEAN, defaultValue: false },
  orden: { type: DataTypes.INTEGER, defaultValue: 1 },
  created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
}, { tableName: 'producto_imagenes', timestamps: false });

export const associateProducto_imagenes = () => {
  const { Producto_variantes } = sequelize.models;

  Producto_imagenes.belongsTo(Producto_variantes, { foreignKey: 'variante_id' });
  Producto_variantes.hasMany(Producto_imagenes, { foreignKey: 'variante_id' });
};
