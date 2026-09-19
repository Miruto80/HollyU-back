import { DataTypes } from 'sequelize';
import sequelize from '../database/db.js';

export const Producto_modelos = sequelize.define('Producto_modelos', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  producto_id: { type: DataTypes.INTEGER, allowNull: false },
  modelo_id: { type: DataTypes.INTEGER, allowNull: false }
}, {
  tableName: 'producto_modelos',
  timestamps: false,
  indexes: [{ unique: true, fields: ['producto_id', 'modelo_id'] }]
});

export const associateProducto_modelos = () => {
  const { Productos, Modelos, Modelo_telas, Modelo_tallas, Detalle_pedido } = sequelize.models;

  Producto_modelos.belongsTo(Productos, { foreignKey: 'producto_id' });
  Productos.hasMany(Producto_modelos, { foreignKey: 'producto_id' });

  Producto_modelos.belongsTo(Modelos, { foreignKey: 'modelo_id' });
  Modelos.hasMany(Producto_modelos, { foreignKey: 'modelo_id' });

  Producto_modelos.hasMany(Modelo_telas, { foreignKey: 'producto_modelo_id' });
  Modelo_telas.belongsTo(Producto_modelos, { foreignKey: 'producto_modelo_id' });

  Producto_modelos.hasMany(Modelo_tallas, { foreignKey: 'producto_modelo_id' });
  Modelo_tallas.belongsTo(Producto_modelos, { foreignKey: 'producto_modelo_id' });

  Producto_modelos.hasMany(Detalle_pedido, { foreignKey: 'producto_modelo_id' });
  Detalle_pedido.belongsTo(Producto_modelos, { foreignKey: 'producto_modelo_id' });
};