import { DataTypes } from 'sequelize';
import sequelize from '../database/db.js';

export const Pedidos = sequelize.define('Pedidos', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  cliente_id: { type: DataTypes.INTEGER, allowNull: false },
  usuario_id: { type: DataTypes.INTEGER },
  tipo_venta_id: { type: DataTypes.INTEGER, allowNull: false },
  estado_pedido_id: { type: DataTypes.INTEGER, allowNull: false },
  subtotal: { type: DataTypes.DECIMAL(12, 2), defaultValue: 0 },
  descuento: { type: DataTypes.DECIMAL(12, 2), defaultValue: 0 },
  total: { type: DataTypes.DECIMAL(12, 2), defaultValue: 0 },
  observaciones: { type: DataTypes.TEXT },
  fecha: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
}, { tableName: 'pedidos', timestamps: false });

export const associatePedidos = () => {
  const { Clientes, Usuarios, Tipos_venta, Estados_pedido, Detalle_pedido, Pagos, Producciones, Personalizaciones, Notificaciones } = sequelize.models;

  Pedidos.belongsTo(Clientes, { foreignKey: 'cliente_id' });
  Clientes.hasMany(Pedidos, { foreignKey: 'cliente_id' });

  Pedidos.belongsTo(Usuarios, { foreignKey: 'usuario_id' });
  Usuarios.hasMany(Pedidos, { foreignKey: 'usuario_id' });

  Pedidos.belongsTo(Tipos_venta, { foreignKey: 'tipo_venta_id' });
  Tipos_venta.hasMany(Pedidos, { foreignKey: 'tipo_venta_id' });

  Pedidos.belongsTo(Estados_pedido, { foreignKey: 'estado_pedido_id' });
  Estados_pedido.hasMany(Pedidos, { foreignKey: 'estado_pedido_id' });

  Pedidos.hasMany(Detalle_pedido, { foreignKey: 'pedido_id' });
  Detalle_pedido.belongsTo(Pedidos, { foreignKey: 'pedido_id' });

  Pedidos.hasMany(Pagos, { foreignKey: 'pedido_id' });
  Pagos.belongsTo(Pedidos, { foreignKey: 'pedido_id' });

  Pedidos.hasMany(Producciones, { foreignKey: 'pedido_id' });
  Producciones.belongsTo(Pedidos, { foreignKey: 'pedido_id' });

  Pedidos.hasMany(Personalizaciones, { foreignKey: 'pedido_id' });
  Personalizaciones.belongsTo(Pedidos, { foreignKey: 'pedido_id' });

  Pedidos.hasMany(Notificaciones, { foreignKey: 'pedido_id' });
  Notificaciones.belongsTo(Pedidos, { foreignKey: 'pedido_id' });
};
