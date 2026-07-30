import { DataTypes } from 'sequelize';
import sequelize from '../database/db.js';


export const Modelo_tallas = sequelize.define(
  'Modelo_tallas',
  {

    id:{
      type:DataTypes.INTEGER,
      primaryKey:true,
      autoIncrement:true
    },

    modelo_id:{
      type:DataTypes.INTEGER,
      allowNull:false
    },

    talla_id:{
      type:DataTypes.INTEGER,
      allowNull:false
    }

  },
  {
    tableName:'modelo_tallas',
    timestamps:false
  }
);


export const associateModelo_tallas = () => {

  const {
    Modelos,
    Tallas
  } = sequelize.models;


  Modelo_tallas.belongsTo(Modelos,{
    foreignKey:'modelo_id'
  });


  Modelos.hasMany(Modelo_tallas,{
    foreignKey:'modelo_id'
  });


  Modelo_tallas.belongsTo(Tallas,{
    foreignKey:'talla_id'
  });


  Tallas.hasMany(Modelo_tallas,{
    foreignKey:'talla_id'
  });

};