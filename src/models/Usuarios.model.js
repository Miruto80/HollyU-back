import { DataTypes } from 'sequelize';
import sequelize from '../database/db.js';

export const Usuarios = sequelize.define('Usuarios', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  rol_id: { type: DataTypes.INTEGER, allowNull: false },
  nombres: { type: DataTypes.STRING(100), allowNull: false },
  apellidos: { type: DataTypes.STRING(100), allowNull: false },
  email: { type: DataTypes.STRING(120), allowNull: false, unique: true },
  telefono: { type: DataTypes.STRING(30) },
  password: { type: DataTypes.TEXT, allowNull: false },
  activo: { type: DataTypes.BOOLEAN, defaultValue: true },
  created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  updated_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
}, { tableName: 'usuarios', timestamps: false });

export const associateUsuarios = () => {
  const { Roles, Pedidos } = sequelize.models;

  Usuarios.belongsTo(Roles, { foreignKey: 'rol_id' });
  Roles.hasMany(Usuarios, { foreignKey: 'rol_id' });

  Usuarios.hasMany(Pedidos, { foreignKey: 'usuario_id' });
  Pedidos.belongsTo(Usuarios, { foreignKey: 'usuario_id' });
};
