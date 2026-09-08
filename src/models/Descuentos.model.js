import { DataTypes } from 'sequelize';
import sequelize from '../database/db.js';

export const Descuentos = sequelize.define('Descuentos', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  tipo_descuento_id: { type: DataTypes.INTEGER, allowNull: false },
  categoria_id: { type: DataTypes.INTEGER, allowNull: true },
  nombre: { type: DataTypes.STRING(120), allowNull: false },
  valor: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
  fecha_inicio: { type: DataTypes.DATE },
  fecha_fin: { type: DataTypes.DATE },
  activo: { type: DataTypes.BOOLEAN, defaultValue: true }
}, { tableName: 'descuentos', timestamps: false });

export const associateDescuentos = () => {
  const { Tipos_descuento, Productos, Categorias, Producto_descuentos } = sequelize.models;

  Descuentos.belongsTo(Tipos_descuento, { foreignKey: 'tipo_descuento_id' });
  Tipos_descuento.hasMany(Descuentos, { foreignKey: 'tipo_descuento_id' });

  Descuentos.belongsTo(Categorias, { foreignKey: 'categoria_id', allowNull: true });
  Categorias.hasMany(Descuentos, { foreignKey: 'categoria_id' });

  Descuentos.belongsToMany(Productos, {
    through: Producto_descuentos,
    foreignKey: 'descuento_id',
    otherKey: 'producto_id'
  });

  Productos.belongsToMany(Descuentos, {
    through: Producto_descuentos,
    foreignKey: 'producto_id',
    otherKey: 'descuento_id'
  });
};
