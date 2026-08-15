import { getPedidos, getPedidosByCliente, getPedidoById, postPedido } from '../services/pedidos.service.js';

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

export const getPedidoByIdController = async (req, res) => {
    try {
        const { id } = req.params;
        const pedido = await getPedidoById(id);

        if (!pedido) {
            return res.status(404).json({ message: 'Pedido no encontrado' });
        }

        res.json(pedido);
    } catch (error) {
        console.error('Error fetching order detail:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

export const postPedidoController = async (req, res) => {
    try {
        const newPedido = await postPedido(req.body);
        res.status(201).json(newPedido);
    } catch (error) {
        console.error('Error creating order:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
