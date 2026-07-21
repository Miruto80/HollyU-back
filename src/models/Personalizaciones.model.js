import { DataTypes } from 'sequelize';
import sequelize from '../database/db.js';

export const Personalizaciones = sequelize.define('Personalizaciones', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  pedido_id: { type: DataTypes.INTEGER, allowNull: false },
  medidas: { type: DataTypes.TEXT },
  nombre_bordado: { type: DataTypes.STRING(100) },
  logo: { type: DataTypes.TEXT },
  color_personalizado: { type: DataTypes.STRING(50) },
  observaciones: { type: DataTypes.TEXT }
}, { tableName: 'personalizaciones', timestamps: false });

export const associatePersonalizaciones = () => {
  const { Pedidos } = sequelize.models;

  Personalizaciones.belongsTo(Pedidos, { foreignKey: 'pedido_id' });
  Pedidos.hasMany(Personalizaciones, { foreignKey: 'pedido_id' });
};
