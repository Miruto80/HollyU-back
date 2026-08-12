import { getTallas, postTallas } from "../services/tallas.service.js";

// Controlador para obtener todas las tallas
export const getTallasController = async (req, res) => {
    try {
        const tallas = await getTallas();
        res.json(tallas);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const postTallasController = async (req, res) => {
    try {
        const tallasData = req.body;
        const newTalla = await postTallas(tallasData);
        res.status(201).json(newTalla);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }   
}
