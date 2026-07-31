import {getProductos, getProductoById} from '../services/productos.service.js';

export const getProductosController = async (req, res) => {
    try {
        const productos = await getProductos();
        res.json(productos);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getProductoByIdController = async (req, res) => {
    try {
        const producto = await getProductoById(req.params.id);
        if (!producto) {
            return res.status(404).json({ message: 'Producto no encontrado' });
        }
        res.json(producto);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
