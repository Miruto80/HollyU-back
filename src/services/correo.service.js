import { smtpTransport } from '../config/smtp.js';
import config from '../config/config.js';

const escapeHtml = (value) => String(value).replace(/[&<>"']/g, (character) => ({
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;'
})[character]);

export const enviarNotificacionNuevoPedido = async ({ pedidoId, total }) => {
  if (!config.smtpTo) {
    throw new Error('SMTP_TO no está configurado');
  }

  const remitente = config.smtpname || config.smtpuser;
  if (!remitente) {
    throw new Error('SMTP_FROM o SMTP_USER debe estar configurado');
  }

  const pedidoIdTexto = String(pedidoId);
  const totalTexto = String(total);
  const pedidoIdHtml = escapeHtml(pedidoIdTexto);
  const totalHtml = escapeHtml(totalTexto);

  await smtpTransport.sendMail({
    from: remitente,
    to: config.smtpTo,
    subject: `Nuevo pedido web #${pedidoId}`,
    text: [
      'Holy Holy',
      '',
      'Nuevo pedido recibido',
      `Pedido web #${pedidoIdTexto}`,
      `Total: ${totalTexto}`,
      '',
      'Ingresa al panel de administración para revisar los detalles del pedido.'
    ].join('\n'),
    html: `
      <!DOCTYPE html>
      <html lang="es">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Nuevo pedido web #${pedidoIdHtml}</title>
        </head>
        <body style="margin:0;padding:0;background-color:#f3f4f7;font-family:Arial,Helvetica,sans-serif;color:#202333;">
          <div style="display:none;max-height:0;overflow:hidden;opacity:0;">
            Se recibió el pedido web #${pedidoIdHtml}.
          </div>
          <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color:#f3f4f7;padding:32px 12px;">
            <tr>
              <td align="center">
                <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="600" style="width:100%;max-width:600px;background-color:#ffffff;border-radius:12px;overflow:hidden;">
                  <tr>
                    <td style="background-color:#080a1c;padding:25px 32px;border-bottom:4px solid #e5b83f;">
                      <p style="margin:0;color:#e5b83f;font-size:13px;font-weight:bold;letter-spacing:4px;">HOLLY</p>
                      <p style="margin:5px 0 0;color:#ffffff;font-size:11px;letter-spacing:3px;">UNIFORMES</p>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding:34px 32px 18px;">
                      <p style="margin:0 0 10px;color:#b28b23;font-size:12px;font-weight:bold;letter-spacing:1.5px;text-transform:uppercase;">Aviso de tienda</p>
                      <h1 style="margin:0;color:#0b2545;font-size:25px;line-height:1.3;">Nuevo pedido recibido</h1>
                      <p style="margin:12px 0 0;color:#68707a;font-size:15px;line-height:1.6;">
                        Se ha registrado un nuevo pedido web. Revisa sus detalles desde el panel de administración.
                      </p>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding:0 32px 32px;">
                      <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color:#f8f8f6;border:1px solid #ebe8df;border-radius:8px;">
                        <tr>
                          <td style="padding:18px 20px;border-bottom:1px solid #ebe8df;">
                            <p style="margin:0 0 6px;color:#68707a;font-size:12px;text-transform:uppercase;letter-spacing:1px;">Número de pedido</p>
                            <p style="margin:0;color:#0b2545;font-size:20px;font-weight:bold;">#${pedidoIdHtml}</p>
                          </td>
                        </tr>
                        <tr>
                          <td style="padding:18px 20px;">
                            <p style="margin:0 0 6px;color:#68707a;font-size:12px;text-transform:uppercase;letter-spacing:1px;">Total del pedido</p>
                            <p style="margin:0;color:#0b2545;font-size:22px;font-weight:bold;">${totalHtml}</p>
                          </td>
                        </tr>
                      </table>
                      <p style="margin:24px 0 0;color:#68707a;font-size:13px;line-height:1.6;">
                        Este es un aviso automático de Holy Holy. No respondas a este correo.
                      </p>
                    </td>
                  </tr>
                  <tr>
                    <td style="background-color:#080a1c;padding:18px 32px;text-align:center;">
                      <p style="margin:0;color:#c5c6ce;font-size:12px;">Holy Holy · Notificación automática</p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </body>
      </html>
    `
  });
};
