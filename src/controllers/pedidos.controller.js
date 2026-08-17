import { getPedidos, getPedidosByCliente, getPedidoById, postPedido, putPagoEstado } from '../services/pedidos.service.js';

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
    const payload = {
      ...req.body,
      items: JSON.parse(req.body.items),
      archivo: req.file
    };

    const pedido = await postPedido(payload);
    res.status(201).json(pedido);
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: error.message });
  }
};

export const putPagoEstadoController = async (req, res) => {
  try {
    const { estado_pago_id } = req.body;

    if (!estado_pago_id) {
      return res.status(400).json({ message: 'estado_pago_id es requerido' });
    }

    const pedido = await putPagoEstado(req.params.id, estado_pago_id);
    res.json(pedido);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};