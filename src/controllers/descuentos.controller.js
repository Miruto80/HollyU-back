import { getDescuentos, getDescuentoById, postDescuento, putDescuento, deleteDescuento } from '../services/descuentos.service.js';

export const getDescuentosController = async (req, res) => {
  try {
    const descuentos = await getDescuentos();
    res.json(descuentos);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getDescuentoByIdController = async (req, res) => {
  try {
    const { id } = req.params;
    const descuento = await getDescuentoById(id);
    if (!descuento) {
      return res.status(404).json({ message: 'Descuento no encontrado' });
    }
    res.json(descuento);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const postDescuentoController = async (req, res) => {
  try {
    const descuento = await postDescuento(req.body);
    res.status(201).json(descuento);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const putDescuentoController = async (req, res) => {
  try {
    const { id } = req.params;
    const descuento = await putDescuento(id, req.body);
    res.json(descuento);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteDescuentoController = async (req, res) => {
  try {
    const { id } = req.params;
    const descuento = await deleteDescuento(id);
    res.json(descuento);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
