import { DataTypes } from 'sequelize';
import sequelize from '../database/db.js';

export const Producto_tallas = sequelize.define(
  'Producto_tallas',
  {
    producto_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
    },
    talla_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
    },
  },
  {
    tableName: 'productos_tallas',
    timestamps: false,
  }
);

export const associateProducto_tallas = () => {
  const { Productos, Tallas } = sequelize.models;

  Producto_tallas.belongsTo(Productos, {
    foreignKey: 'producto_id',
  });

  Producto_tallas.belongsTo(Tallas, {
    foreignKey: 'talla_id',
  });
};