import { DataTypes } from 'sequelize';
import sequelize from '../database/db.js';


export const Tallas = sequelize.define('Tallas', {

  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },

  nombre: {
    type: DataTypes.STRING(20),
    allowNull: false,
    unique: true
  }

}, {
  tableName: 'tallas',
  timestamps: false
});


export const associateTallas = () => {

  const { 
    Modelo_tallas
  } = sequelize.models;


  Tallas.hasMany(Modelo_tallas, {
    foreignKey: 'talla_id'
  });


  Modelo_tallas.belongsTo(Tallas, {
    foreignKey: 'talla_id'
  });

};