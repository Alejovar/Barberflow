interface AppointmentEmailData {
  customerName: string;
  serviceName: string;
  date: string;
  startTime: string;
  managementUrl?: string;
  businessName: string;
}

const wrapper = (title: string, body: string, businessName: string) => `
<!DOCTYPE html>
<html lang="es">
<head><meta charset="UTF-8" /><title>${title}</title></head>
<body style="margin:0;padding:0;background-color:#f4f4f5;font-family:'Helvetica Neue',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f4f5;padding:32px 0;">
    <tr>
      <td align="center">
        <table width="480" cellpadding="0" cellspacing="0" style="background-color:#ffffff;border-radius:12px;overflow:hidden;">
          <tr>
            <td style="background-color:#18181b;padding:24px 32px;">
              <span style="color:#fafafa;font-size:20px;font-weight:700;letter-spacing:-0.02em;">${businessName}</span>
            </td>
          </tr>
          <tr>
            <td style="padding:32px;color:#27272a;font-size:15px;line-height:1.6;">
              ${body}
            </td>
          </tr>
          <tr>
            <td style="padding:20px 32px;background-color:#fafafa;color:#a1a1aa;font-size:12px;">
              Este es un correo automático de ${businessName}. Por favor no respondas a este mensaje.
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;

export function appointmentCreatedTemplate(d: AppointmentEmailData) {
  return wrapper(
    'Reservación recibida',
    `
    <h2 style="margin:0 0 16px;color:#18181b;">¡Hola ${d.customerName}!</h2>
    <p>Tu reservación fue recibida y está <strong>pendiente de confirmación</strong>.</p>
    <table style="width:100%;margin:20px 0;border-collapse:collapse;">
      <tr><td style="padding:6px 0;color:#71717a;">Servicio</td><td style="padding:6px 0;text-align:right;font-weight:600;">${d.serviceName}</td></tr>
      <tr><td style="padding:6px 0;color:#71717a;">Fecha</td><td style="padding:6px 0;text-align:right;font-weight:600;">${d.date}</td></tr>
      <tr><td style="padding:6px 0;color:#71717a;">Hora</td><td style="padding:6px 0;text-align:right;font-weight:600;">${d.startTime}</td></tr>
    </table>
    ${d.managementUrl ? `<a href="${d.managementUrl}" style="display:inline-block;background:#18181b;color:#fafafa;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:600;">Administrar mi cita</a>` : ''}
  `,
    d.businessName,
  );
}

export function appointmentConfirmedTemplate(d: AppointmentEmailData) {
  return wrapper(
    'Cita confirmada',
    `
    <h2 style="margin:0 0 16px;color:#18181b;">¡Tu cita fue confirmada!</h2>
    <p>Hola ${d.customerName}, te esperamos el <strong>${d.date}</strong> a las <strong>${d.startTime}</strong> para tu servicio de <strong>${d.serviceName}</strong>.</p>
    ${d.managementUrl ? `<a href="${d.managementUrl}" style="display:inline-block;background:#18181b;color:#fafafa;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:600;margin-top:12px;">Ver mi cita</a>` : ''}
  `,
    d.businessName,
  );
}

export function appointmentCancelledTemplate(d: AppointmentEmailData) {
  return wrapper(
    'Cita cancelada',
    `
    <h2 style="margin:0 0 16px;color:#18181b;">Cita cancelada</h2>
    <p>Hola ${d.customerName}, tu cita del <strong>${d.date}</strong> a las <strong>${d.startTime}</strong> ha sido cancelada.</p>
    <p>Si fue un error, puedes reservar una nueva cita desde nuestro sitio web.</p>
  `,
    d.businessName,
  );
}

export function appointmentRescheduledTemplate(d: AppointmentEmailData) {
  return wrapper(
    'Cita reagendada',
    `
    <h2 style="margin:0 0 16px;color:#18181b;">Tu cita fue reagendada</h2>
    <p>Hola ${d.customerName}, tu nueva fecha es el <strong>${d.date}</strong> a las <strong>${d.startTime}</strong> para <strong>${d.serviceName}</strong>.</p>
    ${d.managementUrl ? `<a href="${d.managementUrl}" style="display:inline-block;background:#18181b;color:#fafafa;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:600;margin-top:12px;">Ver mi cita</a>` : ''}
  `,
    d.businessName,
  );
}
