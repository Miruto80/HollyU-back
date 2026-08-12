import { getPedidos, getPedidosByCliente } from '../services/pedidos.service.js';

export const getPedidosController = async (req, res) => {
    try {
        const pedidos = await getPedidos(req.query);
        res.json(pedidos);
    } catch (error) {
        console.error('Error fetching orders:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

export const getPedidosByClienteController = async (req, res) => {
    try {
        const { clienteId } = req.params;
        const pedidos = await getPedidosByCliente(clienteId);

        if (!pedidos.length) {
            return res.status(404).json({ message: 'No se encontraron pedidos para este cliente' });
        }

        res.json(pedidos);
    } catch (error) {
        console.error('Error fetching client orders:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};