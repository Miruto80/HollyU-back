import { DataTypes } from 'sequelize';
import sequelize from '../database/db.js';

export const Productos = sequelize.define('Productos', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  categoria_id: { type: DataTypes.INTEGER, allowNull: false },
  genero_id: { type: DataTypes.INTEGER },
  codigo: { type: DataTypes.STRING(50), allowNull: false, unique: true },
  nombre: { type: DataTypes.STRING(200), allowNull: false },
  descripcion: { type: DataTypes.TEXT },
  precio: { type: DataTypes.DECIMAL(10, 2), allowNull: false, defaultValue: 0 },
  precio_mayor: { type: DataTypes.DECIMAL(10, 2) },
  permite_personalizacion: { type: DataTypes.BOOLEAN, defaultValue: true },
  tiempo_fabricacion: { type: DataTypes.INTEGER, defaultValue: 7 },
  activo: { type: DataTypes.BOOLEAN, defaultValue: true },
  created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  updated_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
}, { tableName: 'productos', timestamps: false });

export const associateProductos = () => {
  const { Categorias, Generos, Producto_variantes, Modelos, Producto_imagenes, Detalle_cotizacion } = sequelize.models;

  Productos.belongsTo(Categorias, { foreignKey: 'categoria_id' });
  Categorias.hasMany(Productos, { foreignKey: 'categoria_id' });

  Productos.belongsTo(Generos, { foreignKey: 'genero_id' });
  Generos.hasMany(Productos, { foreignKey: 'genero_id' });

  Productos.hasMany(Producto_variantes, { foreignKey: 'producto_id' });
  Producto_variantes.belongsTo(Productos, { foreignKey: 'producto_id' });

  Productos.hasMany(Producto_imagenes, { foreignKey: 'producto_id' });
  Producto_imagenes.belongsTo(Productos, { foreignKey: 'producto_id' });

  Productos.hasMany(Detalle_cotizacion, { foreignKey: 'producto_id' });
  Detalle_cotizacion.belongsTo(Productos, { foreignKey: 'producto_id' });

  Productos.hasMany(Modelos, { foreignKey: 'producto_id' });
  Modelos.belongsTo(Productos, { foreignKey: 'producto_id'});

};
