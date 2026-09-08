import { DataTypes } from 'sequelize';
import sequelize from '../database/db.js';

export const Tipo_bota = sequelize.define('Tipo_bota', {
	id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
	nombre: { type: DataTypes.STRING(80), allowNull: false, unique: true },
	descripcion: { type: DataTypes.TEXT },
	activo: { type: DataTypes.BOOLEAN, defaultValue: true }
}, { tableName: 'tipo_bota', timestamps: false });

export const associateTipo_bota = () => {
	const { Productos } = sequelize.models;

	Tipo_bota.hasMany(Productos, { foreignKey: 'tipo_bota_id' });
	Productos.belongsTo(Tipo_bota, { foreignKey: 'tipo_bota_id' });
};
