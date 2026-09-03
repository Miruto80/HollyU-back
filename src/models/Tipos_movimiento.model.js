import { DataTypes } from 'sequelize';
import sequelize from '../database/db.js';

export const Tipos_movimiento = sequelize.define('Tipos_movimiento', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  nombre: { type: DataTypes.STRING(50), allowNull: false, unique: true }
}, { tableName: 'tipos_movimiento', timestamps: false });

export const associateTipos_movimiento = () => {};
