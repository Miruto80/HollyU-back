import {getProductos, 
  getProductoById, 
  postProducto, 
  putProducto, 
  deleteProducto, 
  cambiarEstatusProducto, 
  marcarImagenPrincipal, 
  eliminarImagenProducto, reemplazarImagenProducto, getProductosMasVendidos } from '../services/productos.service.js';

export const getProductosController = async (req, res) => {
    try {
        const productos = await getProductos(req.query);
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

export const postProductoController = async (req, res) => {
    try {
        const payload = {
            ...req.body,
            modelos: JSON.parse(req.body.modelos),
            tipo_bota_ids: req.body.tipo_bota_ids ? JSON.parse(req.body.tipo_bota_ids) : [],
            archivos: req.files
        };

        const producto = await postProducto(payload);
        res.status(201).json(producto);
    } catch (error) {
        console.error(error);
        res.status(400).json({ message: error.message });
    }
};

export const putProductoController = async (req, res) => {
  try {
    const payload = {
      ...req.body,
      tipo_bota_ids: req.body.tipo_bota_ids ? JSON.parse(req.body.tipo_bota_ids) : undefined,
      modelos: req.body.modelos ? JSON.parse(req.body.modelos) : undefined,
      archivos: req.files
    };

    const producto = await putProducto(req.params.id, payload);
    res.json(producto);
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: error.message });
  }
};

export const deleteProductoController = async (req, res) => {
  try {
    const resultado = await deleteProducto(req.params.id);
    res.json(resultado);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const patchEstatusProductoController = async (req, res) => {
  try {
    const { estatus } = req.body;
    const producto = await cambiarEstatusProducto(req.params.id, estatus);
    res.json(producto);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteImagenController = async (req, res) => {
  try {
    const producto = await eliminarImagenProducto(req.params.id, req.params.imagenId);
    res.json(producto);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const putImagenController = async (req, res) => {
  try {
    const producto = await reemplazarImagenProducto(req.params.id, req.params.imagenId, req.file);
    res.json(producto);
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: error.message });
  }
};

export const patchImagenPrincipalController = async (req, res) => {
  try {
    const producto = await marcarImagenPrincipal(req.params.id, req.params.imagenId);
    res.json(producto);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getProductosMasVendidosController = async (req, res) => {
  try {
    const limit = req.query.limit ? Number(req.query.limit) : 6;
    const productos = await getProductosMasVendidos(limit);
    res.json(productos);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};