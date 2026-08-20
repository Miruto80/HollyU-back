import { login, register } from '../services/auth.service.js';

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