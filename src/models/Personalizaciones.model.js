import { DataTypes } from 'sequelize';
import sequelize from '../database/db.js';

export const Personalizaciones = sequelize.define('Personalizaciones', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  cliente_id: { type: DataTypes.INTEGER, allowNull: false },
  producto_id: { type: DataTypes.INTEGER, allowNull: false },
  pedido_id: { type: DataTypes.INTEGER },
  descripcion_solicitada: { type: DataTypes.TEXT, allowNull: false },
  imagen_referencia: { type: DataTypes.TEXT },
  estado: { type: DataTypes.STRING(30), allowNull: false, defaultValue: 'pendiente_aprobacion' },
  precio_cotizado: { type: DataTypes.DECIMAL(12, 2) },
  cotizacion_id: { type: DataTypes.INTEGER },
  respuesta_admin: { type: DataTypes.TEXT },
  fecha_aprobacion: { type: DataTypes.DATE },
  fecha_cotizacion: { type: DataTypes.DATE },
  medidas: { type: DataTypes.TEXT },
  nombre_bordado: { type: DataTypes.STRING(100) },
  logo: { type: DataTypes.TEXT },
  color_personalizado: { type: DataTypes.STRING(50) },
  observaciones: { type: DataTypes.TEXT }
}, { tableName: 'personalizaciones', timestamps: false });

export const associatePersonalizaciones = () => {
  const { Clientes, Productos, Pedidos, Cotizaciones } = sequelize.models;

  Personalizaciones.belongsTo(Clientes, { foreignKey: 'cliente_id' });
  Clientes.hasMany(Personalizaciones, { foreignKey: 'cliente_id' });

  Personalizaciones.belongsTo(Productos, { foreignKey: 'producto_id' });
  Productos.hasMany(Personalizaciones, { foreignKey: 'producto_id' });

  Personalizaciones.belongsTo(Pedidos, { foreignKey: 'pedido_id' });
  Pedidos.hasMany(Personalizaciones, { foreignKey: 'pedido_id' });

  Personalizaciones.belongsTo(Cotizaciones, { foreignKey: 'cotizacion_id' });
  Cotizaciones.hasMany(Personalizaciones, { foreignKey: 'cotizacion_id' });
};
