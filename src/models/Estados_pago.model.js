import { DataTypes } from 'sequelize';
import sequelize from '../database/db.js';

export const Estados_pago = sequelize.define('Estados_pago', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  nombre: { type: DataTypes.STRING(50), allowNull: false, unique: true }
}, { tableName: 'estados_pago', timestamps: false });

export const associateEstados_pago = () => {
  const { Pagos } = sequelize.models;

  Estados_pago.hasMany(Pagos, { foreignKey: 'estado_pago_id' });
  Pagos.belongsTo(Estados_pago, { foreignKey: 'estado_pago_id' });
};
