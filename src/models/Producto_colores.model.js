import { DataTypes } from 'sequelize';
import sequelize from '../database/db.js';

export const Producto_colores = sequelize.define(
    "Producto_colores",
    {
        producto_id: {
            type: DataTypes.INTEGER,
            primaryKey: true
        },
        color_id: {
            type: DataTypes.INTEGER,
            primaryKey: true
        }
    },
    {
        tableName: "producto_colores",
        timestamps: false
    }
);

export const associateProducto_colores = () => {
  const { Productos, Colores } = sequelize.models;

  Producto_colores.belongsTo(Productos, {
    foreignKey: "producto_id"
  });

  Producto_colores.belongsTo(Colores, {
    foreignKey: "color_id"
  });
};