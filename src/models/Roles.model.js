import { DataTypes } from 'sequelize';
import sequelize from '../database/db.js';

export const Roles = sequelize.define('Roles', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  nombre: { type: DataTypes.STRING(50), allowNull: false, unique: true },
  descripcion: { type: DataTypes.TEXT },
  created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
}, { tableName: 'roles', timestamps: false });

export const associateRoles = () => {
  const { Usuarios } = sequelize.models;

  Roles.hasMany(Usuarios, { foreignKey: 'rol_id' });
  Usuarios.belongsTo(Roles, { foreignKey: 'rol_id' });
};
