import { DataTypes } from 'sequelize';
import sequelize from '../database/db.js';

export const Clientes = sequelize.define('Clientes', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  tipo_cliente_id: { type: DataTypes.INTEGER, allowNull: false },
  nombres: { type: DataTypes.STRING(120), allowNull: false },
  apellidos: { type: DataTypes.STRING(120) },
  documento: { type: DataTypes.STRING(30) },
  telefono: { type: DataTypes.STRING(30) },
  email: { type: DataTypes.STRING(120) },
  direccion: { type: DataTypes.TEXT },
  ciudad: { type: DataTypes.STRING(80) },
  estado: { type: DataTypes.STRING(80) },
  codigo_postal: { type: DataTypes.STRING(20) },
  observaciones: { type: DataTypes.TEXT },
  activo: { type: DataTypes.BOOLEAN, defaultValue: true },
  created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  updated_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
}, { tableName: 'clientes', timestamps: false });

export const associateClientes = () => {
  const { Tipos_cliente, Direcciones_cliente, Medidas, Pedidos, Cotizaciones, Notificaciones } = sequelize.models;

  Clientes.belongsTo(Tipos_cliente, { foreignKey: 'tipo_cliente_id' });
  Tipos_cliente.hasMany(Clientes, { foreignKey: 'tipo_cliente_id' });

  Clientes.hasMany(Direcciones_cliente, { foreignKey: 'cliente_id' });
  Direcciones_cliente.belongsTo(Clientes, { foreignKey: 'cliente_id' });

  Clientes.hasMany(Medidas, { foreignKey: 'cliente_id' });
  Medidas.belongsTo(Clientes, { foreignKey: 'cliente_id' });

  Clientes.hasMany(Pedidos, { foreignKey: 'cliente_id' });
  Pedidos.belongsTo(Clientes, { foreignKey: 'cliente_id' });

  Clientes.hasMany(Cotizaciones, { foreignKey: 'cliente_id' });
  Cotizaciones.belongsTo(Clientes, { foreignKey: 'cliente_id' });

  Clientes.hasMany(Notificaciones, { foreignKey: 'cliente_id' });
  Notificaciones.belongsTo(Clientes, { foreignKey: 'cliente_id' });
};
