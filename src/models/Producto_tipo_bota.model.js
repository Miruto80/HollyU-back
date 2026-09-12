import { DataTypes } from 'sequelize';
import sequelize from '../database/db.js';

export const Producto_tipo_bota = sequelize.define(
  'Producto_tipo_bota',
  {
    producto_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false
    },
    tipo_bota_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false
    }
  },
  {
    tableName: 'producto_tipo_bota',
    timestamps: false
  }
);

export const associateProducto_tipo_bota = () => {
  const { Productos, Tipo_bota } = sequelize.models;

  Producto_tipo_bota.belongsTo(Productos, { foreignKey: 'producto_id' });
  Producto_tipo_bota.belongsTo(Tipo_bota, { foreignKey: 'tipo_bota_id' });
};