import {getProducciones} from "../services/producciones.service.js";

export const getProduccionesController = async (req, res) => {
    try {
        const filters = req.query;
        const producciones = await getProducciones(filters);
        res.json(producciones);
    } catch (error) {
        console.error('Error in getProduccionesController:', error);
        res.status(500).json({ message: 'Error fetching producciones' });
    }
};