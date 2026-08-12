import { getClientes } from "../services/clientes.service.js";

export const getClientesController = async (req, res) => {
    try {
        const clientes = await getClientes();
        res.json(clientes);
    } catch (error) {
        console.error('Error fetching clients:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};