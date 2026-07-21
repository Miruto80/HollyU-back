import { DataTypes } from 'sequelize';
import sequelize from '../database/db.js';

export const Tipos_tela = sequelize.define('Tipos_tela', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  nombre: { type: DataTypes.STRING(80), allowNull: false, unique: true },
  descripcion: { type: DataTypes.TEXT }
}, { tableName: 'tipos_tela', timestamps: false });

export const associateTipos_tela = () => {
  const { Productos } = sequelize.models;

  Tipos_tela.hasMany(Productos, { foreignKey: 'tipo_tela_id' });
  Productos.belongsTo(Tipos_tela, { foreignKey: 'tipo_tela_id' });
};
