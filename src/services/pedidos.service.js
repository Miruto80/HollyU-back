import { Pedidos, Clientes, Estados_pedido, Tipos_venta } from "../models/index.js";

export const getPedidos = async (filters = {}) => {
    try {
        const where = {};

        if (filters.cliente_id) {
            where.cliente_id = filters.cliente_id;
        }

        const pedidos = await Pedidos.findAll({
            where,
            include: [
                {
                    model: Clientes,
                    attributes: ['id', 'nombres', 'apellidos', 'email', 'telefono']
                },
                {
                    model: Estados_pedido,
                    attributes: ['id', 'nombre']
                },
                {
                    model: Tipos_venta,
                    attributes: ['id', 'nombre']
                }
            ],
            order: [['fecha', 'DESC']]
        });

        return pedidos;
    } catch (error) {
        console.error('Error fetching orders:', error);
        throw error;
    }
};

export const getPedidosByCliente = async (clienteId) => {
    try {
        return await getPedidos({ cliente_id: clienteId });
    } catch (error) {
        console.error('Error fetching client orders:', error);
        throw error;
    }
};