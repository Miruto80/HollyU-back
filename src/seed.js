


import {
  Roles,
  Usuarios,
  Clientes,
  Categorias,
  Tipos_cliente,
  Tipos_tela,
  Generos,
  Colores,
  Tallas,
  Productos,
  Producto_variantes
} from './models/index.js';

const createOrFind = async (Model, where, defaults = {}) => {
  const [record, created] = await Model.findOrCreate({ where, defaults });
  if (created) {
    console.log(`Registro creado: ${Model.name} -> ${JSON.stringify(where)}`);
  }
  return record;
};

export const seedInitialData = async () => {
  try {
    const adminRole = await createOrFind(
      Roles,
      { nombre: 'Administrador' },
      { descripcion: 'Rol con acceso total al sistema' }
    );

    const clientRole = await createOrFind(
      Roles,
      { nombre: 'Cliente' },
      { descripcion: 'Rol para clientes del e-commerce' }
    );

    const tipoParticular = await createOrFind(Tipos_cliente, { nombre: 'Particular' });
    const tipoEmpresa = await createOrFind(Tipos_cliente, { nombre: 'Empresa' });

    const categoriaVestidos = await createOrFind(
      Categorias,
      { nombre: 'Vestidos' },
      { descripcion: 'Prendas femeninas y eventos' }
    );

    const categoriaConjuntos = await createOrFind(
      Categorias,
      { nombre: 'Conjuntos' },
      { descripcion: 'Conjuntos y outfits completos' }
    );

    const categoriaAccesorios = await createOrFind(
      Categorias,
      { nombre: 'Accesorios' },
      { descripcion: 'Complementos para moda' }
    );

    const tipoTelaSeda = await createOrFind(
      Tipos_tela,
      { nombre: 'Seda' },
      { descripcion: 'Tela fina de seda' }
    );

    const tipoTelaAlgodon = await createOrFind(
      Tipos_tela,
      { nombre: 'Algodón' },
      { descripcion: 'Tela cómoda y versátil' }
    );

    const generoFemenino = await createOrFind(Generos, { nombre: 'Femenino' });
    const generoMasculino = await createOrFind(Generos, { nombre: 'Masculino' });
    const generoUnisex = await createOrFind(Generos, { nombre: 'Unisex' });

    const colorNegro = await createOrFind(Colores, { nombre: 'Negro' }, { codigo_hex: '#111111' });
    const colorBlanco = await createOrFind(Colores, { nombre: 'Blanco' }, { codigo_hex: '#FFFFFF' });
    const colorAzul = await createOrFind(Colores, { nombre: 'Azul' }, { codigo_hex: '#1D4ED8' });

    const tallaXS = await createOrFind(Tallas, { nombre: 'XS' });
    const tallaS = await createOrFind(Tallas, { nombre: 'S' });
    const tallaM = await createOrFind(Tallas, { nombre: 'M' });
    const tallaL = await createOrFind(Tallas, { nombre: 'L' });

    await createOrFind(
      Usuarios,
      { email: 'admin@hollyu.com' },
      {
        rol_id: adminRole.id,
        nombres: 'Administrador',
        apellidos: 'HollyU',
        telefono: '3000000000',
        password: '123456',
        activo: true
      }
    );

    await createOrFind(
      Usuarios,
      { email: 'cliente@hollyu.com' },
      {
        rol_id: clientRole.id,
        nombres: 'Cliente',
        apellidos: 'Demo',
        telefono: '3010000000',
        password: '123456',
        activo: true
      }
    );

    await createOrFind(
      Clientes,
      { documento: '9999999999' },
      {
        tipo_cliente_id: tipoParticular.id,
        nombres: 'Cliente',
        apellidos: 'Demo',
        telefono: '3010000000',
        email: 'cliente@hollyu.com',
        direccion: 'Calle 123',
        ciudad: 'Bogotá',
        estado: 'Cundinamarca',
        codigo_postal: '110111',
        observaciones: 'Cliente base para pruebas',
        activo: true
      }
    );

    const vestidoBase = await createOrFind(
      Productos,
      { codigo: 'HOL-001' },
      {
        categoria_id: categoriaVestidos.id,
        tipo_tela_id: tipoTelaSeda.id,
        genero_id: generoFemenino.id,
        nombre: 'Vestido de gala',
        descripcion: 'Vestido elegante para eventos especiales',
        permite_personalizacion: true,
        tiempo_fabricacion: 7,
        activo: true
      }
    );

    const conjuntoBase = await createOrFind(
      Productos,
      { codigo: 'HOL-002' },
      {
        categoria_id: categoriaConjuntos.id,
        tipo_tela_id: tipoTelaAlgodon.id,
        genero_id: generoUnisex.id,
        nombre: 'Conjunto casual',
        descripcion: 'Conjunto cómodo para uso diario',
        permite_personalizacion: true,
        tiempo_fabricacion: 5,
        activo: true
      }
    );

    await createOrFind(
      Producto_variantes,
      { sku: 'HOL-001-NEG-XS' },
      {
        producto_id: vestidoBase.id,
        color_id: colorNegro.id,
        talla_id: tallaXS.id,
        precio: 180000,
        precio_mayor: 160000,
        stock: 12,
        stock_minimo: 3,
        activo: true
      }
    );

    await createOrFind(
      Producto_variantes,
      { sku: 'HOL-002-BLA-M' },
      {
        producto_id: conjuntoBase.id,
        color_id: colorBlanco.id,
        talla_id: tallaM.id,
        precio: 140000,
        precio_mayor: 125000,
        stock: 8,
        stock_minimo: 2,
        activo: true
      }
    );

    console.log('Seed inicial completado para HollyU');
  } catch (error) {
    console.error('Error al ejecutar la seed inicial de HollyU:', error.message);
    throw error;
  }
};
