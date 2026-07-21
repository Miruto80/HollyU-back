import { DataTypes } from 'sequelize';
import sequelize from '../database/db.js';

export const Detalle_pedido = sequelize.define('Detalle_pedido', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  pedido_id: { type: DataTypes.INTEGER, allowNull: false },
  variante_id: { type: DataTypes.INTEGER, allowNull: false },
  cantidad: { type: DataTypes.INTEGER, allowNull: false },
  precio: { type: DataTypes.DECIMAL(12, 2), allowNull: false },
  descuento: { type: DataTypes.DECIMAL(12, 2), defaultValue: 0 }
}, { tableName: 'detalle_pedido', timestamps: false });

export const associateDetalle_pedido = () => {
  const { Pedidos, Producto_variantes } = sequelize.models;

  Detalle_pedido.belongsTo(Pedidos, { foreignKey: 'pedido_id' });
  Pedidos.hasMany(Detalle_pedido, { foreignKey: 'pedido_id' });

  Detalle_pedido.belongsTo(Producto_variantes, { foreignKey: 'variante_id' });
  Producto_variantes.hasMany(Detalle_pedido, { foreignKey: 'variante_id' });
};
