import bcrypt from 'bcryptjs';
import { Usuarios, Roles } from '../models/index.js';
import tokenUtil from '../utils/token.util.js';

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

  const payload = {
    id: usuario.id,
    username: usuario.email,
    role: usuario.Roles?.nombre,
    clientId: null
  };

  const accessToken = tokenUtil.generateToken(payload, 'access');
  const refreshToken = tokenUtil.generateToken(payload, 'refresh');

  return {
    accessToken,
    refreshToken,
    usuario: {
      id: usuario.id,
      nombres: usuario.nombres,
      apellidos: usuario.apellidos,
      email: usuario.email,
      rol: usuario.Roles?.nombre
    }
  };
};