import { DataTypes } from 'sequelize';
import sequelize from '../database/db.js';

export const Producto_descuentos = sequelize.define('Producto_descuentos', {
  producto_id: { type: DataTypes.INTEGER, primaryKey: true },
  descuento_id: { type: DataTypes.INTEGER, primaryKey: true }
}, { tableName: 'producto_descuentos', timestamps: false });

export const associateProducto_descuentos = () => {
  const { Productos, Descuentos } = sequelize.models;

  Productos.belongsToMany(Descuentos, { through: Producto_descuentos, foreignKey: 'producto_id', otherKey: 'descuento_id' });
  Descuentos.belongsToMany(Productos, { through: Producto_descuentos, foreignKey: 'descuento_id', otherKey: 'producto_id' });
};
