import { DataTypes } from 'sequelize';
import sequelize from '../database/db.js';

export const Producto_variantes = sequelize.define('Producto_variantes', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  producto_id: { type: DataTypes.INTEGER, allowNull: false },
  color_id: { type: DataTypes.INTEGER, allowNull: false },
  talla_id: { type: DataTypes.INTEGER, allowNull: false },
  sku: { type: DataTypes.STRING(80), allowNull: false, unique: true },
  precio: { type: DataTypes.DECIMAL(12, 2), allowNull: false },
  precio_mayor: { type: DataTypes.DECIMAL(12, 2) },
  stock: { type: DataTypes.INTEGER, defaultValue: 0, allowNull: false },
  stock_minimo: { type: DataTypes.INTEGER, defaultValue: 5 },
  activo: { type: DataTypes.BOOLEAN, defaultValue: true }
}, { tableName: 'producto_variantes', timestamps: false, indexes: [{ unique: true, fields: ['producto_id','color_id','talla_id'] }] });

export const associateProducto_variantes = () => {
  const { Productos, Colores, Tallas, Producto_imagenes, Detalle_pedido } = sequelize.models;

  Producto_variantes.belongsTo(Productos, { foreignKey: 'producto_id' });
  Productos.hasMany(Producto_variantes, { foreignKey: 'producto_id' });

  Producto_variantes.belongsTo(Colores, { foreignKey: 'color_id' });
  Colores.hasMany(Producto_variantes, { foreignKey: 'color_id' });

  Producto_variantes.belongsTo(Tallas, { foreignKey: 'talla_id' });
  Tallas.hasMany(Producto_variantes, { foreignKey: 'talla_id' });

  Producto_variantes.hasMany(Producto_imagenes, { foreignKey: 'variante_id' });
  Producto_imagenes.belongsTo(Producto_variantes, { foreignKey: 'variante_id' });

  Producto_variantes.hasMany(Detalle_pedido, { foreignKey: 'variante_id' });
  Detalle_pedido.belongsTo(Producto_variantes, { foreignKey: 'variante_id' });
};
