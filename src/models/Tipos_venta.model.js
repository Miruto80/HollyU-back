import { DataTypes } from 'sequelize';
import sequelize from '../database/db.js';

export const Tipos_venta = sequelize.define('Tipos_venta', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  nombre: { type: DataTypes.STRING(50), allowNull: false, unique: true }
}, { tableName: 'tipos_venta', timestamps: false });

export const associateTipos_venta = () => {
  const { Pedidos } = sequelize.models;

  Tipos_venta.hasMany(Pedidos, { foreignKey: 'tipo_venta_id' });
  Pedidos.belongsTo(Tipos_venta, { foreignKey: 'tipo_venta_id' });
};
