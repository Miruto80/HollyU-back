import { DataTypes } from 'sequelize';
import sequelize from '../database/db.js';

export const Detalle_pedido = sequelize.define('Detalle_pedido', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  pedido_id: { type: DataTypes.INTEGER, allowNull: false },

  // Producto del catálogo, con sus opciones elegidas.
  producto_id: { type: DataTypes.INTEGER },
  modelo_id: { type: DataTypes.INTEGER },
  tipo_tela_id: { type: DataTypes.INTEGER },
  color_id: { type: DataTypes.INTEGER },
  talla_id: { type: DataTypes.INTEGER },

  cantidad: { type: DataTypes.INTEGER, allowNull: false },
  precio: { type: DataTypes.DECIMAL(12, 2), allowNull: false },
  descuento: { type: DataTypes.DECIMAL(12, 2), defaultValue: 0 }
}, { tableName: 'detalle_pedido', timestamps: false });

export const associateDetalle_pedido = () => {
  const { Pedidos, Productos, Modelos, Tipos_tela, Colores, Tallas } = sequelize.models;

  Detalle_pedido.belongsTo(Pedidos, { foreignKey: 'pedido_id' });
  Pedidos.hasMany(Detalle_pedido, { foreignKey: 'pedido_id' });

  Detalle_pedido.belongsTo(Productos, { foreignKey: 'producto_id' });
  Productos.hasMany(Detalle_pedido, { foreignKey: 'producto_id' });

  Detalle_pedido.belongsTo(Modelos, { foreignKey: 'modelo_id' });
  Modelos.hasMany(Detalle_pedido, { foreignKey: 'modelo_id' });

  Detalle_pedido.belongsTo(Tipos_tela, { foreignKey: 'tipo_tela_id' });
  Tipos_tela.hasMany(Detalle_pedido, { foreignKey: 'tipo_tela_id' });

  Detalle_pedido.belongsTo(Colores, { foreignKey: 'color_id' });
  Colores.hasMany(Detalle_pedido, { foreignKey: 'color_id' });

  Detalle_pedido.belongsTo(Tallas, { foreignKey: 'talla_id' });
  Tallas.hasMany(Detalle_pedido, { foreignKey: 'talla_id' });
};