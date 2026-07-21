import { DataTypes } from 'sequelize';
import sequelize from '../database/db.js';

export const Estados_produccion = sequelize.define('Estados_produccion', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  nombre: { type: DataTypes.STRING(50), allowNull: false, unique: true },
  orden: { type: DataTypes.INTEGER, allowNull: false }
}, { tableName: 'estados_produccion', timestamps: false });

export const associateEstados_produccion = () => {
  const { Producciones } = sequelize.models;

  Estados_produccion.hasMany(Producciones, { foreignKey: 'estado_produccion_id' });
  Producciones.belongsTo(Estados_produccion, { foreignKey: 'estado_produccion_id' });
};
