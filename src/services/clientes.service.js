import { Op } from "sequelize";
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
    const documento = datos.documento?.trim();
    const email = datos.email?.trim().toLowerCase();
    if (!documento && !email) {
      throw new Error("Se requiere un documento o correo para identificar al cliente");
    }

    const [cliente, creado] = await Clientes.findOrCreate({
      where: {
        [Op.or]: [
          ...(documento ? [{ documento }] : []),
          ...(email ? [{ email }] : [])
        ]
      },
      defaults: {
        nombres: datos.nombres,
        apellidos: datos.apellidos,
        documento,
        telefono: datos.telefono,
        tipo_cliente_id: datos.tipo_cliente_id,
        email,
        activo: true
      }
    });

    if (!creado) {
      throw new Error("Ya existe un cliente registrado con ese documento o correo electrónico");
    }

    return cliente;
  } catch (error) {
    console.error(error);
    throw error;
  }
};