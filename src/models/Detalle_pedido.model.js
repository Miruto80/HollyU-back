import { DataTypes } from 'sequelize';
import sequelize from '../database/db.js';

export const Detalle_pedido = sequelize.define('Detalle_pedido', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  pedido_id: { type: DataTypes.INTEGER, allowNull: false },

  producto_id: { type: DataTypes.INTEGER },
  producto_modelo_id: { type: DataTypes.INTEGER }, 
  modelo_tela_id: { type: DataTypes.INTEGER },
  color_id: { type: DataTypes.INTEGER },
  talla_id: { type: DataTypes.INTEGER },
  tipo_bota_id: { type: DataTypes.INTEGER },

  cantidad: { type: DataTypes.INTEGER, allowNull: false },
  precio: { type: DataTypes.DECIMAL(12, 2), allowNull: false },
  descuento: { type: DataTypes.DECIMAL(12, 2), defaultValue: 0 }
}, { tableName: 'detalle_pedido', timestamps: false });

export const associateDetalle_pedido = () => {
  const { Pedidos, Productos, Producto_modelos, Modelo_telas, Colores, Tallas, Tipo_bota } = sequelize.models;

  Detalle_pedido.belongsTo(Pedidos, { foreignKey: 'pedido_id' });
  Pedidos.hasMany(Detalle_pedido, { foreignKey: 'pedido_id' });

  Detalle_pedido.belongsTo(Productos, { foreignKey: 'producto_id' });
  Productos.hasMany(Detalle_pedido, { foreignKey: 'producto_id' });

  Detalle_pedido.belongsTo(Producto_modelos, { foreignKey: 'producto_modelo_id' });
  Producto_modelos.hasMany(Detalle_pedido, { foreignKey: 'producto_modelo_id' });

  Detalle_pedido.belongsTo(Modelo_telas, { foreignKey: 'modelo_tela_id' }); // 👈 Corregido
  Modelo_telas.hasMany(Detalle_pedido, { foreignKey: 'modelo_tela_id' });

  Detalle_pedido.belongsTo(Colores, { foreignKey: 'color_id' });
  Colores.hasMany(Detalle_pedido, { foreignKey: 'color_id' });

  Detalle_pedido.belongsTo(Tallas, { foreignKey: 'talla_id' });
  Tallas.hasMany(Detalle_pedido, { foreignKey: 'talla_id' });

  Detalle_pedido.belongsTo(Tipo_bota, { foreignKey: 'tipo_bota_id' });
  Tipo_bota.hasMany(Detalle_pedido, { foreignKey: 'tipo_bota_id' });
};