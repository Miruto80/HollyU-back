import { login } from '../services/auth.service.js';

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