import { DataTypes } from 'sequelize';
import sequelize from '../database/db.js';

export const Tipos_descuento = sequelize.define('Tipos_descuento', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  nombre: { type: DataTypes.STRING(40), allowNull: false, unique: true }
}, { tableName: 'tipos_descuento', timestamps: false });

export const associateTipos_descuento = () => {
  const { Descuentos } = sequelize.models;

  Tipos_descuento.hasMany(Descuentos, { foreignKey: 'tipo_descuento_id' });
  Descuentos.belongsTo(Tipos_descuento, { foreignKey: 'tipo_descuento_id' });
};
