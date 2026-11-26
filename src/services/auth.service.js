import bcrypt from 'bcryptjs';
import { createHash, randomBytes } from 'node:crypto';
import { Op } from 'sequelize';
import sequelize from '../database/db.js';
import { Usuarios, Roles, Clientes, Tipos_cliente, PasswordResetTokens } from '../models/index.js';
import tokenUtil from '../utils/token.util.js';
import { enviarCorreoRestablecerContrasena } from './correo.service.js';

const PASSWORD_RESET_TTL_MS = 60 * 60 * 1000;

export class PasswordResetEmailError extends Error {
  constructor(cause) {
    super('No se pudo enviar el correo para restablecer la contraseña', { cause });
    this.name = 'PasswordResetEmailError';
  }
}

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

export const solicitarRestablecimientoContrasena = async (email) => {
  const emailNormalizado = email.trim().toLowerCase();
  const usuario = await Usuarios.findOne({
    where: { email: emailNormalizado, activo: true },
    attributes: ['id', 'nombres', 'email']
  });

  if (!usuario) return;

  const token = randomBytes(32).toString('hex');
  const tokenHash = createHash('sha256').update(token).digest('hex');
  const expiresAt = new Date(Date.now() + PASSWORD_RESET_TTL_MS);

  await sequelize.transaction(async (transaction) => {
    await PasswordResetTokens.destroy({
      where: { usuario_id: usuario.id },
      transaction
    });

    await PasswordResetTokens.create({
      usuario_id: usuario.id,
      token_hash: tokenHash,
      expires_at: expiresAt
    }, { transaction });
  });

  try {
    await enviarCorreoRestablecerContrasena({
      email: usuario.email,
      nombres: usuario.nombres,
      token
    });
  } catch (error) {
    try {
      await PasswordResetTokens.destroy({ where: { token_hash: tokenHash } });
    } catch (cleanupError) {
      console.error('No se pudo invalidar el token de restablecimiento tras fallar el correo:', cleanupError);
    }

    throw new PasswordResetEmailError(error);
  }
};

export const restablecerContrasena = async ({ token, password }) => {
  const tokenHash = createHash('sha256').update(token).digest('hex');

  await sequelize.transaction(async (transaction) => {
    const resetToken = await PasswordResetTokens.findOne({
      where: {
        token_hash: tokenHash,
        used_at: null,
        expires_at: { [Op.gt]: new Date() }
      },
      transaction,
      lock: transaction.LOCK.UPDATE
    });

    if (!resetToken) {
      throw new Error('El enlace de restablecimiento no es válido o ha expirado');
    }

    const usuario = await Usuarios.findOne({
      where: { id: resetToken.usuario_id, activo: true },
      transaction,
      lock: transaction.LOCK.UPDATE
    });

    if (!usuario) {
      throw new Error('El enlace de restablecimiento no es válido o ha expirado');
    }

    await usuario.update({
      password: await bcrypt.hash(password, 10),
      updated_at: new Date()
    }, { transaction });

    await resetToken.update({ used_at: new Date() }, { transaction });
    await PasswordResetTokens.destroy({
      where: {
        usuario_id: usuario.id,
        id: { [Op.ne]: resetToken.id }
      },
      transaction
    });
  });
};