import { DataTypes } from 'sequelize';
import sequelize from '../database/db.js';

export const Modelos = sequelize.define('Modelos', {

  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },

  producto_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },

  nombre: {
    type: DataTypes.STRING(100),
    allowNull: false
  },

  descripcion: {
    type: DataTypes.TEXT
  },

  activo: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },

  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },

  updated_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }

}, {
  tableName: 'modelos',
  timestamps: false
});


export const associateModelos = () => {

  const { 
    Productos, 
    Modelo_telas,
    Tallas,
    Modelo_tallas
  } = sequelize.models;


  // Un producto tiene varios modelos y un modelo pertenece a un producto
  Productos.hasMany(Modelos, {foreignKey: 'producto_id'});
  Modelos.belongsTo(Productos, {foreignKey: 'producto_id'});


  // Un modelo tiene diferentes telas con precios
  Modelos.hasMany(Modelo_telas, {foreignKey: 'modelo_id'});
  Modelo_telas.belongsTo(Modelos, {foreignKey: 'modelo_id'});


  // Tallas disponibles por modelo
  Modelos.belongsToMany(Tallas, {
    through: Modelo_tallas,
    foreignKey: 'modelo_id',
    otherKey: 'talla_id'
  });


  Tallas.belongsToMany(Modelos, {
    through: Modelo_tallas,
    foreignKey: 'talla_id',
    otherKey: 'modelo_id'
  });

};