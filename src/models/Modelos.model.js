import { DataTypes } from 'sequelize';
import sequelize from '../database/db.js';

export const Modelos = sequelize.define('Modelos', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  nombre: { type: DataTypes.STRING(100), allowNull: false, unique: true }
}, {
  tableName: 'modelos',
  timestamps: false
});

export const associateModelos = () => {
  const { Producto_modelos } = sequelize.models;

  Modelos.hasMany(Producto_modelos, { foreignKey: 'modelo_id' });
  Producto_modelos.belongsTo(Modelos, { foreignKey: 'modelo_id' });
};