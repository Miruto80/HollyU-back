import { DataTypes } from 'sequelize';
import sequelize from '../database/db.js';

export const Estados_pedido = sequelize.define('Estados_pedido', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  nombre: { type: DataTypes.STRING(50), allowNull: false, unique: true },
  color: { type: DataTypes.STRING(20) }
}, { tableName: 'estados_pedido', timestamps: false });

export const associateEstados_pedido = () => {
  const { Pedidos } = sequelize.models;

  Estados_pedido.hasMany(Pedidos, { foreignKey: 'estado_pedido_id' });
  Pedidos.belongsTo(Estados_pedido, { foreignKey: 'estado_pedido_id' });
};
