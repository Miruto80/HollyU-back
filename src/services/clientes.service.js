import { Clientes } from "../models/index.js";

export const getClientes = async () => {
    try {
        const clientes = await Clientes.findAll();
        return clientes;
    } catch (error) {
        console.error('Error fetching clients:', error);
        throw error;
    }
};