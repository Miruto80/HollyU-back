import fs from "fs";
import path from "path";
import { Categorias } from "../models/index.js";

const CATEGORY_IMAGE_FOLDER = path.resolve("uploads", "categories");

const removeFile = async (filePath) => {
    try {
        await fs.promises.unlink(filePath);
    } catch (error) {
        if (error.code !== "ENOENT") {
            console.error("Error removing category image:", error);
        }
    }
};

const removeTemporaryImage = async (file) => {
    if (file?.path) await removeFile(file.path);
};

const getStoredImagePath = (imageUrl) => {
    const prefix = "/uploads/categories/";
    if (!imageUrl?.startsWith(prefix)) return null;

    return path.join(CATEGORY_IMAGE_FOLDER, path.basename(imageUrl));
};

const removeCategoryImage = async (imageUrl) => {
    const filePath = getStoredImagePath(imageUrl);
    if (filePath) await removeFile(filePath);
};

const storeCategoryImage = (file) => {
    fs.mkdirSync(CATEGORY_IMAGE_FOLDER, { recursive: true });
    const filename = path.basename(file.filename);
    const destination = path.join(CATEGORY_IMAGE_FOLDER, filename);
    fs.renameSync(file.path, destination);
    return `/uploads/categories/${filename}`;
};

const normalizeCategoryData = (categoryData) => ({
    ...categoryData,
    ...(categoryData.activo !== undefined && {
        activo: categoryData.activo === true || categoryData.activo === "true"
    })
});

export const getCategorias = async () => {
    try {
        const categorias = await Categorias.findAll();
        return categorias;
    } catch (error) {
        throw new Error("Error al obtener los categorias");
    }
};

export const getCategoriasById = async (id) => {
    try {
        const categoria = await Categorias.findByPk(id);
        return categoria;
    } catch (error) {
        throw new Error("Error al obtener la categoria");
    }
};

export const postCategorias = async (categoriaData, file) => {
    let imageUrl;
    try {
        if (file) imageUrl = storeCategoryImage(file);
        return await Categorias.create({
            ...normalizeCategoryData(categoriaData),
            ...(imageUrl ? { imagen: imageUrl } : {})
        });
    } catch (error) {
        if (imageUrl) await removeCategoryImage(imageUrl);
        else await removeTemporaryImage(file);
        throw error;
    }
}

export const putCategorias = async (id, categoriaData, file) => {
    const categoria = await Categorias.findByPk(id);
    if (!categoria) {
        await removeTemporaryImage(file);
        throw new Error("Categoria no encontrada");
    }

    const previousImage = categoria.imagen;
    let imageUrl;
    try {
        if (file) imageUrl = storeCategoryImage(file);
        await categoria.update({
            ...normalizeCategoryData(categoriaData),
            ...(imageUrl ? { imagen: imageUrl } : {})
        });
        if (imageUrl) await removeCategoryImage(previousImage);
        return categoria;
    } catch (error) {
        if (imageUrl) await removeCategoryImage(imageUrl);
        else await removeTemporaryImage(file);
        throw error;
    }
};

export const deleteCategorias = async (id) => {
    try {
        const categoria = await Categorias.findByPk(id);
        if (!categoria) {
            throw new Error("Categoria no encontrada");
        }
        await categoria.destroy();
        await removeCategoryImage(categoria.imagen);
        return categoria;
    } catch (error) {
        throw new Error("Error al eliminar la categoria");
    }
};
