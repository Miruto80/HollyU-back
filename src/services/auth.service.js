import bcrypt from 'bcryptjs';
import { Usuarios, Roles, Clientes, Tipos_cliente } from '../models/index.js';
import tokenUtil from '../utils/token.util.js';

const createTokens = (usuario) => {
  const payload = {
    id: usuario.id,
    username: usuario.email,
    role: usuario.Role?.nombre,
    clientId: null
  };

  return {
    accessToken: tokenUtil.generateToken(payload, 'access'),
    refreshToken: tokenUtil.generateToken(payload, 'refresh')
  };
};

export const login = async (email, password) => {
  const usuario = await Usuarios.findOne({
    where: { email },
    include: [{ model: Roles, attributes: ['id', 'nombre'] }]
  });

  if (!usuario || !usuario.activo) {
    throw new Error('Credenciales inválidas');
  }

  const passwordValida = await bcrypt.compare(password, usuario.password);
  if (!passwordValida) {
    throw new Error('Credenciales inválidas');
  }

  return {
    ...createTokens(usuario),
    usuario: {
      id: usuario.id,
      nombres: usuario.nombres,
      apellidos: usuario.apellidos,
      email: usuario.email,
      rol: usuario.Role?.nombre
    }
  };
};

export const register = async ({ nombres, apellidos, documento, email, telefono, password }) => {
  const emailNormalizado = email.trim().toLowerCase();
  const usuarioExistente = await Usuarios.findOne({ where: { email: emailNormalizado } });

  if (usuarioExistente) {
    throw new Error('El correo electrónico ya está registrado');
  }

  const rolCliente = await Roles.findOne({ where: { nombre: 'Cliente' } });
  const tipoParticular = await Tipos_cliente.findOne({ where: { nombre: 'Particular' } });

  if (!rolCliente || !tipoParticular) {
    throw new Error('La configuración de clientes no está disponible');
  }

  const usuario = await Usuarios.create({
    rol_id: rolCliente.id,
    nombres: nombres.trim(),
    apellidos: apellidos.trim(),
    email: emailNormalizado,
    telefono: telefono?.trim() || null,
    password: await bcrypt.hash(password, 10),
    activo: true
  });

  await Clientes.create({
    tipo_cliente_id: tipoParticular.id,
    nombres: nombres.trim(),
    apellidos: apellidos.trim(),
    documento: documento.trim(),
    telefono: telefono?.trim() || null,
    email: emailNormalizado,
    activo: true
  });

  usuario.Role = rolCliente;

  return {
    ...createTokens(usuario),
    usuario: {
      id: usuario.id,
      nombres: usuario.nombres,
      apellidos: usuario.apellidos,
      email: usuario.email,
      rol: rolCliente.nombre
    }
  };
};