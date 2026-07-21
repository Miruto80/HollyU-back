import { DataTypes } from 'sequelize';
import sequelize from '../database/db.js';

export const Direcciones_cliente = sequelize.define('Direcciones_cliente', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  cliente_id: { type: DataTypes.INTEGER, allowNull: false },
  nombre: { type: DataTypes.STRING(80) },
  direccion: { type: DataTypes.TEXT, allowNull: false },
  ciudad: { type: DataTypes.STRING(80) },
  estado: { type: DataTypes.STRING(80) },
  codigo_postal: { type: DataTypes.STRING(20) },
  principal: { type: DataTypes.BOOLEAN, defaultValue: false }
}, { tableName: 'direcciones_cliente', timestamps: false });

export const associateDirecciones_cliente = () => {
  const { Clientes } = sequelize.models;

  Direcciones_cliente.belongsTo(Clientes, { foreignKey: 'cliente_id' });
  Clientes.hasMany(Direcciones_cliente, { foreignKey: 'cliente_id' });
};
