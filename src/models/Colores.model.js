import { DataTypes } from 'sequelize';
import sequelize from '../database/db.js';


export const Colores = sequelize.define('Colores', {

  id:{
    type:DataTypes.INTEGER,
    primaryKey:true,
    autoIncrement:true
  },

  nombre:{
    type:DataTypes.STRING(50),
    allowNull:false,
    unique:true
  },

  codigo_hex:{
    type:DataTypes.STRING(7)
  }

}, {
  tableName:'colores',
  timestamps:false
});


export const associateColores = () => {

  const {
    Modelo_telas_colores,
    Modelo_telas
  } = sequelize.models;


  Colores.hasMany(Modelo_telas_colores,{
    foreignKey:'color_id'
  });


  Modelo_telas_colores.belongsTo(Colores,{
    foreignKey:'color_id'
  });


};