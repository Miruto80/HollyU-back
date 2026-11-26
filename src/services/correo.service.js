import { smtpTransport } from '../config/smtp.js';
import config from '../config/config.js';

export const enviarNotificacionNuevoPedido = async ({ pedidoId, total }) => {
  if (!config.smtpTo) {
    throw new Error('SMTP_TO no está configurado');
  }

  const remitente = config.smtpname || config.smtpuser;
  if (!remitente) {
    throw new Error('SMTP_FROM o SMTP_USER debe estar configurado');
  }

  await smtpTransport.sendMail({
    from: remitente,
    to: config.smtpTo,
    subject: `Nuevo pedido web #${pedidoId}`,
    text: `Se recibió el pedido web #${pedidoId}. Total: ${total}.`,
    html: `<p>Se recibió el pedido web <strong>#${pedidoId}</strong>.</p><p>Total: ${total}.</p>`
  });
};
