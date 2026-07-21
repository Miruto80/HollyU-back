import sequelize from '../database/db.js';
import { Categorias, associateCategorias } from './Categorias.model.js';
import { Clientes, associateClientes } from './Clientes.model.js';
import { Colores, associateColores } from './Colores.model.js';
import { Cotizaciones, associateCotizaciones } from './Cotizaciones.model.js';
import { Detalle_cotizacion, associateDetalle_cotizacion } from './Detalle_cotizacion.model.js';
import { Detalle_pedido, associateDetalle_pedido } from './Detalle_pedido.model.js';
import { Direcciones_cliente, associateDirecciones_cliente } from './Direcciones_cliente.model.js';
import { Estados_cotizacion, associateEstados_cotizacion } from './Estados_cotizacion.model.js';
import { Estados_pago, associateEstados_pago } from './Estados_pago.model.js';
import { Estados_pedido, associateEstados_pedido } from './Estados_pedido.model.js';
import { Estados_produccion, associateEstados_produccion } from './Estados_produccion.model.js';
import { Generos, associateGeneros } from './Generos.model.js';
import { Medidas, associateMedidas } from './Medidas.model.js';
import { Metodos_pago, associateMetodos_pago } from './Metodos_pago.model.js';
import { Notificaciones, associateNotificaciones } from './Notificaciones.model.js';
import { Pagos, associatePagos } from './Pagos.model.js';
import { Pedidos, associatePedidos } from './Pedidos.model.js';
import { Personalizaciones, associatePersonalizaciones } from './Personalizaciones.model.js';
import { Producciones, associateProducciones } from './Producciones.model.js';
import { Productos, associateProductos } from './Productos.model.js';
import { Producto_imagenes, associateProducto_imagenes } from './Producto_imagenes.model.js';
import { Producto_variantes, associateProducto_variantes } from './Producto_variantes.model.js';
import { Roles, associateRoles } from './Roles.model.js';
import { Tallas, associateTallas } from './Tallas.model.js';
import { Tipos_cliente, associateTipos_cliente } from './Tipos_cliente.model.js';
import { Tipos_tela, associateTipos_tela } from './Tipos_tela.model.js';
import { Tipos_venta, associateTipos_venta } from './Tipos_venta.model.js';
import { Usuarios, associateUsuarios } from './Usuarios.model.js';

export const associateAllModels = (models = sequelize.models) => {
  associateCategorias(models);
  associateClientes(models);
  associateColores(models);
  associateCotizaciones(models);
  associateDetalle_cotizacion(models);
  associateDetalle_pedido(models);
  associateDirecciones_cliente(models);
  associateEstados_cotizacion(models);
  associateEstados_pago(models);
  associateEstados_pedido(models);
  associateEstados_produccion(models);
  associateGeneros(models);
  associateMedidas(models);
  associateMetodos_pago(models);
  associateNotificaciones(models);
  associatePagos(models);
  associatePedidos(models);
  associatePersonalizaciones(models);
  associateProducciones(models);
  associateProductos(models);
  associateProducto_imagenes(models);
  associateProducto_variantes(models);
  associateRoles(models);
  associateTallas(models);
  associateTipos_cliente(models);
  associateTipos_tela(models);
  associateTipos_venta(models);
  associateUsuarios(models);
};

export {
  Categorias,
  Clientes,
  Colores,
  Cotizaciones,
  Detalle_cotizacion,
  Detalle_pedido,
  Direcciones_cliente,
  Estados_cotizacion,
  Estados_pago,
  Estados_pedido,
  Estados_produccion,
  Generos,
  Medidas,
  Metodos_pago,
  Notificaciones,
  Pagos,
  Pedidos,
  Personalizaciones,
  Producciones,
  Productos,
  Producto_imagenes,
  Producto_variantes,
  Roles,
  Tallas,
  Tipos_cliente,
  Tipos_tela,
  Tipos_venta,
  Usuarios
};
