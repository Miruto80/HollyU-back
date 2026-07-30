


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
  Modelos,
  Modelo_telas,
  Modelo_telas_colores,
  Modelo_tallas
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

    const categoriaEnfermeria = await createOrFind(
  Categorias,
  { nombre: 'Enfermería' },
  { descripcion: 'Uniformes clínicos para personal de salud' }
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

    const tipoTelaAntifluido = await createOrFind(
  Tipos_tela,
  { nombre: 'Antifluido' },
  { descripcion: 'Tela resistente a líquidos para uso médico' }
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

    const pijamaEnfermeria = await createOrFind(
  Productos,
  { codigo: 'ENF-001' },
  {
    categoria_id: categoriaEnfermeria.id,
    genero_id: generoUnisex.id,
    nombre: 'Pijama quirúrgica antifluido',
    descripcion: 'Conjunto médico antifluido para enfermería y personal de salud',
    permite_personalizacion: true,
    tiempo_fabricacion: 7,
    activo: true
  }
);

const modeloCuelloV = await createOrFind(
  Modelos,
  {
    producto_id: pijamaEnfermeria.id,
    nombre: 'Cuello V'
  },
  {
    descripcion: 'Pijama clínica cuello V'
  }
);

const modeloTelaAntifluido = await createOrFind(
  Modelo_telas,
  {
    modelo_id: modeloCuelloV.id,
    tipo_tela_id: tipoTelaAntifluido.id
  },
  {
    precio: 95000,
    precio_mayor: 85000
  }
);

await createOrFind(
  Modelo_tallas,
  {
    modelo_id: modeloCuelloV.id,
    talla_id: tallaS.id
  }
);


await createOrFind(
  Modelo_tallas,
  {
    modelo_id: modeloCuelloV.id,
    talla_id: tallaM.id
  }
);


await createOrFind(
  Modelo_tallas,
  {
    modelo_id: modeloCuelloV.id,
    talla_id: tallaL.id
  }
);

await createOrFind(
  Modelo_telas_colores,
  {
    modelo_tela_id: modeloTelaAntifluido.id,
    color_id: colorAzul.id
  }
);


await createOrFind(
  Modelo_telas_colores,
  {
    modelo_tela_id: modeloTelaAntifluido.id,
    color_id: colorBlanco.id
  }
);


await createOrFind(
  Modelo_telas_colores,
  {
    modelo_tela_id: modeloTelaAntifluido.id,
    color_id: colorNegro.id
  }
);

    console.log('Seed inicial completado para HollyU');
  } catch (error) {
    console.error('Error al ejecutar la seed inicial de HollyU:', error.message);
    throw error;
  }
};
