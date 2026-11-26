import { smtpTransport } from '../config/smtp.js';
import config from '../config/config.js';
import { enviarNotificacionNuevoPedido } from '../services/correo.service.js';

try {
  if (!config.smtpTo) {
    throw new Error('SMTP_TO no está configurado');
  }

  await smtpTransport.verify();
  await enviarNotificacionNuevoPedido({
    pedidoId: 'PRUEBA',
    total: 'Bs. 125,00'
  });
  console.log('Correo de prueba enviado con la plantilla de nuevo pedido.');
} catch (error) {
  console.error('No se pudo enviar el correo de prueba SMTP:', error);
  process.exitCode = 1;
} finally {
  smtpTransport.close();
}
