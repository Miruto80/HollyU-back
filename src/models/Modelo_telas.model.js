import { DataTypes } from 'sequelize';
import sequelize from '../database/db.js';


export const Modelo_telas = sequelize.define('Modelo_telas',{

    id:{
        type:DataTypes.INTEGER,
        primaryKey:true,
        autoIncrement:true
    },

    modelo_id:{
        type:DataTypes.INTEGER,
        allowNull:false
    },

    tipo_tela_id:{
        type:DataTypes.INTEGER,
        allowNull:false
    },

},{
    tableName:'modelo_telas',
    timestamps:false
});


export const associateModelo_telas = () => {

const {
    Modelos,
    Tipos_tela
}=sequelize.models;


Modelo_telas.belongsTo(Modelos,{
    foreignKey:'modelo_id'
});


Modelo_telas.belongsTo(Tipos_tela,{
    foreignKey:'tipo_tela_id'
});


Modelos.hasMany(Modelo_telas,{
    foreignKey:'modelo_id'
});


Tipos_tela.hasMany(Modelo_telas,{
    foreignKey:'tipo_tela_id'
});

};