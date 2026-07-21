import { DataTypes } from 'sequelize';
import sequelize from '../database/db.js';

export const Pagos = sequelize.define('Pagos', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  pedido_id: { type: DataTypes.INTEGER, allowNull: false },
  metodo_pago_id: { type: DataTypes.INTEGER, allowNull: false },
  estado_pago_id: { type: DataTypes.INTEGER, allowNull: false },
  monto: { type: DataTypes.DECIMAL(12, 2), allowNull: false },
  referencia: { type: DataTypes.STRING(100) },
  fecha: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
}, { tableName: 'pagos', timestamps: false });

export const associatePagos = () => {
  const { Pedidos, Metodos_pago, Estados_pago } = sequelize.models;

  Pagos.belongsTo(Pedidos, { foreignKey: 'pedido_id' });
  Pedidos.hasMany(Pagos, { foreignKey: 'pedido_id' });

  Pagos.belongsTo(Metodos_pago, { foreignKey: 'metodo_pago_id' });
  Metodos_pago.hasMany(Pagos, { foreignKey: 'metodo_pago_id' });

  Pagos.belongsTo(Estados_pago, { foreignKey: 'estado_pago_id' });
  Estados_pago.hasMany(Pagos, { foreignKey: 'estado_pago_id' });
};
