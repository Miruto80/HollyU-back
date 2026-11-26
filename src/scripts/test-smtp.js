import { smtpTransport } from '../config/smtp.js';
import config from '../config/config.js';

try {
  if (!config.smtpTo) {
    throw new Error('SMTP_TO no está configurado');
  }

  await smtpTransport.verify();
  const result = await smtpTransport.sendMail({
    from: config.smtpname || config.smtpuser,
    to: config.smtpTo,
    subject: 'Prueba SMTP de HollyU',
    text: 'El envío de correo de HollyU está funcionando.'
  });
  console.log(`Correo de prueba enviado: ${result.messageId}`);
} catch (error) {
  console.error('No se pudo enviar el correo de prueba SMTP:', error);
  process.exitCode = 1;
} finally {
  smtpTransport.close();
}
