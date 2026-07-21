import { DataTypes } from 'sequelize';
import sequelize from '../database/db.js';

export const Metodos_pago = sequelize.define('Metodos_pago', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  nombre: { type: DataTypes.STRING(50), allowNull: false, unique: true }
}, { tableName: 'metodos_pago', timestamps: false });

export const associateMetodos_pago = () => {
  const { Pagos } = sequelize.models;

  Metodos_pago.hasMany(Pagos, { foreignKey: 'metodo_pago_id' });
  Pagos.belongsTo(Metodos_pago, { foreignKey: 'metodo_pago_id' });
};
