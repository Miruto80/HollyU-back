import { DataTypes } from 'sequelize';
import sequelize from '../database/db.js';

export const Notificaciones = sequelize.define('Notificaciones', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  cliente_id: { type: DataTypes.INTEGER },
  pedido_id: { type: DataTypes.INTEGER },
  tipo: { type: DataTypes.STRING(50) },
  mensaje: { type: DataTypes.TEXT, allowNull: false },
  enviado: { type: DataTypes.BOOLEAN, defaultValue: false },
  fecha: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
}, { tableName: 'notificaciones', timestamps: false });

export const associateNotificaciones = () => {
  const { Clientes, Pedidos } = sequelize.models;

  Notificaciones.belongsTo(Clientes, { foreignKey: 'cliente_id' });
  Clientes.hasMany(Notificaciones, { foreignKey: 'cliente_id' });

  Notificaciones.belongsTo(Pedidos, { foreignKey: 'pedido_id' });
  Pedidos.hasMany(Notificaciones, { foreignKey: 'pedido_id' });
};
