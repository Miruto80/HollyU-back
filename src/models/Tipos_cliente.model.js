import { DataTypes } from 'sequelize';
import sequelize from '../database/db.js';

export const Tipos_cliente = sequelize.define('Tipos_cliente', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  nombre: { type: DataTypes.STRING(40), allowNull: false, unique: true }
}, { tableName: 'tipos_cliente', timestamps: false });

export const associateTipos_cliente = () => {
  const { Clientes } = sequelize.models;

  Tipos_cliente.hasMany(Clientes, { foreignKey: 'tipo_cliente_id' });
  Clientes.belongsTo(Tipos_cliente, { foreignKey: 'tipo_cliente_id' });
};
