import { DataTypes } from 'sequelize';
import sequelize from '../database/db.js';


export const Modelo_telas_colores = sequelize.define(
  'Modelo_telas_colores',
  {

    id:{
      type:DataTypes.INTEGER,
      primaryKey:true,
      autoIncrement:true
    },

    modelo_tela_id:{
      type:DataTypes.INTEGER,
      allowNull:false
    },

    color_id:{
      type:DataTypes.INTEGER,
      allowNull:false
    }

  },
  {
    tableName:'modelo_telas_colores',
    timestamps:false
  }
);


export const associateModelo_telas_colores = () => {

  const {
    Modelo_telas,
    Colores
  } = sequelize.models;


  Modelo_telas_colores.belongsTo(Modelo_telas,{
    foreignKey:'modelo_tela_id'
  });


  Modelo_telas.hasMany(Modelo_telas_colores,{
    foreignKey:'modelo_tela_id'
  });


  Modelo_telas_colores.belongsTo(Colores,{
    foreignKey:'color_id',
    as:'color'
});


  Colores.hasMany(Modelo_telas_colores,{
    foreignKey:'color_id'
  });

};