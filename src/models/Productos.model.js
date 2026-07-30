import { DataTypes } from 'sequelize';
import sequelize from '../database/db.js';

export const Productos = sequelize.define('Productos', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  categoria_id: { type: DataTypes.INTEGER, allowNull: false },
  tipo_tela_id: { type: DataTypes.INTEGER },
  genero_id: { type: DataTypes.INTEGER },
  codigo: { type: DataTypes.STRING(50), allowNull: false, unique: true },
  nombre: { type: DataTypes.STRING(200), allowNull: false },
  descripcion: { type: DataTypes.TEXT },
  permite_personalizacion: { type: DataTypes.BOOLEAN, defaultValue: true },
  tiempo_fabricacion: { type: DataTypes.INTEGER, defaultValue: 7 },
  activo: { type: DataTypes.BOOLEAN, defaultValue: true },
  created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  updated_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
}, { tableName: 'productos', timestamps: false });

export const associateProductos = () => {
  const { Categorias, Tipos_tela, Generos, Producto_variantes, Producto_imagenes, Detalle_cotizacion, Colores, Tallas, Producto_colores, Producto_tallas } = sequelize.models;

  Productos.belongsTo(Categorias, { foreignKey: 'categoria_id' });
  Categorias.hasMany(Productos, { foreignKey: 'categoria_id' });

  Productos.belongsTo(Tipos_tela, { foreignKey: 'tipo_tela_id' });
  Tipos_tela.hasMany(Productos, { foreignKey: 'tipo_tela_id' });

  Productos.belongsTo(Generos, { foreignKey: 'genero_id' });
  Generos.hasMany(Productos, { foreignKey: 'genero_id' });

  Productos.hasMany(Producto_variantes, { foreignKey: 'producto_id' });
  Producto_variantes.belongsTo(Productos, { foreignKey: 'producto_id' });

  Productos.hasMany(Producto_imagenes, { foreignKey: 'producto_id' });
  Producto_imagenes.belongsTo(Productos, { foreignKey: 'producto_id' });

  Productos.hasMany(Detalle_cotizacion, { foreignKey: 'producto_id' });
  Detalle_cotizacion.belongsTo(Productos, { foreignKey: 'producto_id' });

    Productos.belongsToMany(Colores, {
    through: Producto_colores,
    foreignKey: 'producto_id',
    otherKey: 'color_id'
  });
  Productos.belongsToMany(Tallas, {
  through: Producto_tallas,
  foreignKey: 'producto_id',
  otherKey: 'talla_id'
});
};
