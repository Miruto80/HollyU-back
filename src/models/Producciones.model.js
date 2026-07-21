import { DataTypes } from 'sequelize';
import sequelize from '../database/db.js';

export const Producciones = sequelize.define('Producciones', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  pedido_id: { type: DataTypes.INTEGER, allowNull: false },
  estado_produccion_id: { type: DataTypes.INTEGER, allowNull: false },
  fecha_inicio: { type: DataTypes.DATE },
  fecha_final: { type: DataTypes.DATE },
  observaciones: { type: DataTypes.TEXT }
}, { tableName: 'producciones', timestamps: false });

export const associateProducciones = () => {
  const { Pedidos, Estados_produccion } = sequelize.models;

  Producciones.belongsTo(Pedidos, { foreignKey: 'pedido_id' });
  Pedidos.hasMany(Producciones, { foreignKey: 'pedido_id' });

  Producciones.belongsTo(Estados_produccion, { foreignKey: 'estado_produccion_id' });
  Estados_produccion.hasMany(Producciones, { foreignKey: 'estado_produccion_id' });
};
