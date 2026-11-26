import {
  login,
  register,
  restablecerContrasena,
  solicitarRestablecimientoContrasena,
  PasswordResetEmailError
} from '../services/auth.service.js';

export const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Correo y contraseña son requeridos' });
    }

    const result = await login(email, password);
    res.json(result);
  } catch (error) {
    res.status(401).json({ message: error.message });
  }
};

export const registerController = async (req, res) => {
  try {
    const { nombres, apellidos, documento, email, telefono, password } = req.body;

    if (!nombres || !apellidos || !documento || !email || !password) {
      return res.status(400).json({ message: 'Nombres, apellidos, cédula, correo y contraseña son requeridos' });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: 'La contraseña debe tener al menos 6 caracteres' });
    }

    res.status(201).json(await register({ nombres, apellidos, documento, email, telefono, password }));
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const solicitarRestablecimientoContrasenaController = async (req, res) => {
  const { email } = req.body;

  if (typeof email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
    return res.status(400).json({ message: 'Ingresa un correo electrónico válido' });
  }

  try {
    await solicitarRestablecimientoContrasena(email);
    return res.status(202).json({
      message: 'Si el correo está asociado a una cuenta activa, recibirás instrucciones para restablecer tu contraseña.'
    });
  } catch (error) {
    console.error('Error al solicitar restablecimiento de contraseña:', error);

    if (error instanceof PasswordResetEmailError) {
      return res.status(202).json({
        message: 'Si el correo está asociado a una cuenta activa, recibirás instrucciones para restablecer tu contraseña.'
      });
    }

    return res.status(500).json({ message: 'No se pudo procesar la solicitud. Intenta más tarde.' });
  }
};

export const restablecerContrasenaController = async (req, res) => {
  const { token, password } = req.body;

  if (typeof token !== 'string' || !/^[a-f0-9]{64}$/i.test(token)) {
    return res.status(400).json({ message: 'El enlace de restablecimiento no es válido o ha expirado' });
  }

  if (typeof password !== 'string' || password.length < 6) {
    return res.status(400).json({ message: 'La contraseña debe tener al menos 6 caracteres' });
  }

  try {
    await restablecerContrasena({ token, password });
    return res.json({ message: 'Tu contraseña se actualizó. Ya puedes iniciar sesión.' });
  } catch (error) {
    if (error.message === 'El enlace de restablecimiento no es válido o ha expirado') {
      return res.status(400).json({ message: error.message });
    }

    console.error('Error al restablecer contraseña:', error);
    return res.status(500).json({ message: 'No se pudo actualizar la contraseña. Intenta más tarde.' });
  }
};