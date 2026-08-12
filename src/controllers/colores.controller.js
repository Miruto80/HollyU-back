import { getColores, postColores } from "../services/colores.service.js";

// Controlador para obtener todos los colores
export const getColoresController = async (req, res) => {
    try {
        const colores = await getColores();
        res.json(colores);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const postColoresController = async (req, res) => {
    try {
        const coloresData = req.body;
        const newColor = await postColores(coloresData);
        res.status(201).json(newColor);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }   
}
