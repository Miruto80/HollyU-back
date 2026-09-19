import { DataTypes } from 'sequelize';
import sequelize from '../database/db.js';

export const Modelo_telas = sequelize.define('Modelo_telas', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  producto_modelo_id: { type: DataTypes.INTEGER, allowNull: false }, // antes: modelo_id
  tipo_tela_id: { type: DataTypes.INTEGER, allowNull: false }
}, { tableName: 'modelo_telas', timestamps: false });

export const associateModelo_telas = () => {
  const { Tipos_tela, Modelo_telas_colores } = sequelize.models;

  Modelo_telas.belongsTo(Tipos_tela, { foreignKey: 'tipo_tela_id' });
  Tipos_tela.hasMany(Modelo_telas, { foreignKey: 'tipo_tela_id' });

  Modelo_telas.hasMany(Modelo_telas_colores, { foreignKey: 'modelo_tela_id' });
  Modelo_telas_colores.belongsTo(Modelo_telas, { foreignKey: 'modelo_tela_id' });
};