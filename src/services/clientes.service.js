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


export const getClienteByEmail = async (email) => {
    try {
        return await Clientes.findOne({ where: { email } });
    } catch (error) {
        console.error('Error fetching client by email:', error);
        throw error;
    }
};

export const buscarOCrearCliente = async (datos) => {
  try {
    const [cliente] = await Clientes.findOrCreate({
      where: { email: datos.email },
      defaults: {
        nombres: datos.nombres,
        apellidos: datos.apellidos,
        documento: datos.documento,
        telefono: datos.telefono,
        tipo_cliente_id: datos.tipo_cliente_id,
        activo: true
      }
    });
    return cliente;
  } catch (error) {
    console.error(error);
    throw error;
  }
};