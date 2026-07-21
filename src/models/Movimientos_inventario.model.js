import { DataTypes } from 'sequelize';
import sequelize from '../database/db.js';

export const Movimientos_inventario = sequelize.define('Movimientos_inventario', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  variante_id: { type: DataTypes.INTEGER, allowNull: false },
  tipo_movimiento_id: { type: DataTypes.INTEGER, allowNull: false },
  usuario_id: { type: DataTypes.INTEGER },
  cantidad: { type: DataTypes.INTEGER, allowNull: false },
  observacion: { type: DataTypes.TEXT },
  created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
}, { tableName: 'movimientos_inventario', timestamps: false });

export const associateMovimientos_inventario = () => {
  const { Producto_variantes, Tipos_movimiento, Usuarios } = sequelize.models;

  Movimientos_inventario.belongsTo(Producto_variantes, { foreignKey: 'variante_id' });
  Producto_variantes.hasMany(Movimientos_inventario, { foreignKey: 'variante_id' });

  Movimientos_inventario.belongsTo(Tipos_movimiento, { foreignKey: 'tipo_movimiento_id' });
  Tipos_movimiento.hasMany(Movimientos_inventario, { foreignKey: 'tipo_movimiento_id' });

  Movimientos_inventario.belongsTo(Usuarios, { foreignKey: 'usuario_id' });
  Usuarios.hasMany(Movimientos_inventario, { foreignKey: 'usuario_id' });
};
