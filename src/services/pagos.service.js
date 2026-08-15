import fs from 'fs';
import path from 'path';
import sequelize from '../database/db.js';
import { Pagos, Pedidos } from '../models/index.js';

export const postPagos = async (payload) => {
  const t = await sequelize.transaction();

  try {
    const {
      pedido_id,
      metodo_pago_id,
      estado_pago_id,
      monto,
      referencia,
      banco_origen,
      banco_destino,
      telefono_emisor,
      archivo
    } = payload;

    let comprobantePath = null;

    if (archivo) {
      const destFolder = path.join('uploads', 'pagos');
      if (!fs.existsSync(destFolder)) {
        fs.mkdirSync(destFolder, { recursive: true });
      }

      const destPath = path.join(destFolder, archivo.filename);
      fs.renameSync(archivo.path, destPath);

      comprobantePath = `/uploads/pagos/${archivo.filename}`;
    }

    const pago = await Pagos.create({
      pedido_id,
      metodo_pago_id,
      estado_pago_id,
      monto,
      referencia,
      banco_origen,
      banco_destino,
      telefono_emisor,
      comprobante: comprobantePath
    }, { transaction: t });

    await t.commit();
    return pago;

  } catch (error) {
    await t.rollback();
    if (payload.archivo) fs.unlink(payload.archivo.path, () => {});
    console.error(error);
    throw error;
  }
};