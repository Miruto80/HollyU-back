import {getProductos} from '../services/productos.service.js';

export const getProductosController = async (req, res) => {
    try {
        const productos = await getProductos();
        res.json(productos);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

