import { getClientes, getClienteByEmail, buscarOCrearCliente } from "../services/clientes.service.js";

export const getClientesController = async (req, res) => {
    try {
        const clientes = await getClientes();
        res.json(clientes);
    } catch (error) {
        console.error('Error fetching clients:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

export const getMeController = async (req, res) => {
    try {
        const cliente = await getClienteByEmail(req.user.username);
        if (!cliente) {
            return res.status(404).json({ message: 'No se encontró un cliente asociado a este usuario' });
        }
        res.json(cliente);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const postBuscarOCrearController = async (req, res) => {
  try {
    const cliente = await buscarOCrearCliente(req.body);
    res.json(cliente);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};