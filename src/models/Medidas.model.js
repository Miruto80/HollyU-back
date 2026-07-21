import { DataTypes } from 'sequelize';
import sequelize from '../database/db.js';

export const Medidas = sequelize.define('Medidas', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  cliente_id: { type: DataTypes.INTEGER },
  pecho: { type: DataTypes.DECIMAL(6, 2) },
  cintura: { type: DataTypes.DECIMAL(6, 2) },
  cadera: { type: DataTypes.DECIMAL(6, 2) },
  hombros: { type: DataTypes.DECIMAL(6, 2) },
  manga: { type: DataTypes.DECIMAL(6, 2) },
  largo: { type: DataTypes.DECIMAL(6, 2) },
  observaciones: { type: DataTypes.TEXT },
  created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
}, { tableName: 'medidas', timestamps: false });

export const associateMedidas = () => {
  const { Clientes } = sequelize.models;

  Medidas.belongsTo(Clientes, { foreignKey: 'cliente_id' });
  Clientes.hasMany(Medidas, { foreignKey: 'cliente_id' });
};
