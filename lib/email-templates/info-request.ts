/**
 * Template del mail que recibe quien pide "más info" desde /contact.
 * HTML con estilos inline y layout de tablas: los clientes de correo (Gmail,
 * Outlook) no soportan CSS variables ni casi nunca <style> externo, así que
 * acá SÍ van colores literales -- es la única excepción a la regla de
 * DESIGN.md, porque el contexto de render es distinto (no es un componente
 * de la app, es un documento HTML de email aparte).
 */

// TODO: reemplazar por el link real a la página/PDF del CV cuando Fernando lo confirme.
const CV_URL = "https://fernando-tuquina-personal-hub.vercel.app/about";
const GITHUB_URL = "https://github.com/Tuquina";
const LINKEDIN_URL = "https://www.linkedin.com/in/fernandonahueltuquina/";
const EMAIL = "fernandotuquina@gmail.com";
const SITE_URL = "https://fernando-tuquina-personal-hub.vercel.app";

const COLORS = {
  ink: "#06080f",
  card: "#0b0e18",
  primary: "#e8ecf4",
  secondary: "#a8b3c7",
  muted: "#8b94a7",
  faint: "#5c6577",
  accent: "#7aa2ff",
  border: "rgba(139,148,167,.18)",
};

function linkButton(label: string, href: string) {
  return `<a href="${href}" style="display:inline-block;padding:12px 22px;border-radius:8px;border:1px solid ${COLORS.border};color:${COLORS.primary};text-decoration:none;font-family:'JetBrains Mono',Consolas,monospace;font-size:12px;letter-spacing:.04em;margin:0 8px 8px 0;">${label}</a>`;
}

function factRow(label: string, value: string, isLast: boolean) {
  return `
    <tr>
      <td style="padding:13px 0;border-top:1px solid ${COLORS.border};${isLast ? "" : ""}color:${COLORS.muted};font-family:Arial,Helvetica,sans-serif;font-size:14px;">${label}</td>
      <td style="padding:13px 0;border-top:1px solid ${COLORS.border};color:${COLORS.primary};font-family:Arial,Helvetica,sans-serif;font-size:14px;text-align:right;">${value}</td>
    </tr>`;
}

export function buildInfoRequestEmail() {
  const subject = "Fernando Tuquina — Software Engineer";

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>${subject}</title>
</head>
<body style="margin:0;padding:0;background:${COLORS.ink};">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${COLORS.ink};padding:40px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:${COLORS.card};border:1px solid ${COLORS.border};border-radius:14px;overflow:hidden;">

          <!-- header -->
          <tr>
            <td style="padding:36px 40px 0 40px;">
              <span style="font-family:Arial,Helvetica,sans-serif;font-weight:800;font-size:16px;color:${COLORS.primary};">ft<span style="color:${COLORS.accent};">.</span></span>
              <div style="margin-top:18px;font-family:'JetBrains Mono',Consolas,monospace;font-size:11px;letter-spacing:.14em;color:${COLORS.faint};text-transform:uppercase;">Gracias por tu interés</div>
              <div style="margin-top:10px;font-family:Arial,Helvetica,sans-serif;font-weight:800;font-size:28px;line-height:1.2;color:${COLORS.primary};">
                Hola, soy <span style="color:${COLORS.accent};font-style:italic;font-weight:400;">Fernando Tuquina</span>.
              </div>
            </td>
          </tr>

          <!-- cover letter -->
          <tr>
            <td style="padding:22px 40px 0 40px;">
              <p style="margin:0 0 16px 0;font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:1.65;color:${COLORS.secondary};">
                Soy ingeniero de sistemas radicado en Buenos Aires, terminando mi carrera de Ingeniería en Sistemas.
                Mi día a día es backend en sistemas financieros — Java, Spring Boot, arquitectura limpia, y el tipo
                de SQL que tiene que estar bien a la primera.
              </p>
              <p style="margin:0 0 16px 0;font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:1.65;color:${COLORS.secondary};">
                Me importa el software predecible y honesto — sin magia, sin sorpresas. Es la misma disciplina que
                aplico entrenando: aparecer, registrar el trabajo, confiar en la acumulación.
              </p>
              <p style="margin:0;font-family:Arial,Helvetica,sans-serif;font-style:italic;font-size:15px;line-height:1.65;color:${COLORS.muted};">
                Fuera del código: corridas largas antes del amanecer, un viaje de snowboard en el calendario, y una
                cantidad irrazonable de manga.
              </p>
            </td>
          </tr>

          <!-- facts -->
          <tr>
            <td style="padding:28px 40px 0 40px;">
              <div style="font-family:'JetBrains Mono',Consolas,monospace;font-size:11px;letter-spacing:.14em;color:${COLORS.faint};text-transform:uppercase;margin-bottom:4px;">Datos rápidos</div>
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                ${factRow("Base", "Buenos Aires, AR", false)}
                ${factRow("Foco", "Sistemas financieros", false)}
                ${factRow("Stack", "Java · Spring · .NET · SQL", false)}
                ${factRow("Título", "Ing. en Sistemas — en curso", false)}
                ${factRow("Estado", `<span style="color:${COLORS.accent};">Open to senior roles</span>`, true)}
              </table>
            </td>
          </tr>

          <!-- links -->
          <tr>
            <td style="padding:30px 40px 8px 40px;">
              <div style="font-family:'JetBrains Mono',Consolas,monospace;font-size:11px;letter-spacing:.14em;color:${COLORS.faint};text-transform:uppercase;margin-bottom:14px;">Seguí explorando</div>
              ${linkButton("CV / más sobre mí →", CV_URL)}
              ${linkButton("GitHub ↗", GITHUB_URL)}
              ${linkButton("LinkedIn ↗", LINKEDIN_URL)}
              ${linkButton("Escribime →", `mailto:${EMAIL}`)}
            </td>
          </tr>

          <!-- footer -->
          <tr>
            <td style="padding:28px 40px 32px 40px;border-top:1px solid ${COLORS.border};margin-top:20px;">
              <p style="margin:0;font-family:'JetBrains Mono',Consolas,monospace;font-size:11px;color:${COLORS.faint};line-height:1.6;">
                Este mail se generó automáticamente porque pediste más info en
                <a href="${SITE_URL}" style="color:${COLORS.muted};">${SITE_URL.replace("https://", "")}</a>.
                Si no fuiste vos, podés ignorarlo.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

  const text = `Hola, soy Fernando Tuquina.

Soy ingeniero de sistemas radicado en Buenos Aires, terminando mi carrera de Ingeniería en Sistemas. Mi día a día es backend en sistemas financieros — Java, Spring Boot, arquitectura limpia, y el tipo de SQL que tiene que estar bien a la primera.

Me importa el software predecible y honesto — sin magia, sin sorpresas.

Fuera del código: corridas largas antes del amanecer, un viaje de snowboard en el calendario, y una cantidad irrazonable de manga.

Datos rápidos
- Base: Buenos Aires, AR
- Foco: Sistemas financieros
- Stack: Java · Spring · .NET · SQL
- Título: Ing. en Sistemas — en curso
- Estado: Open to senior roles

Seguí explorando:
- CV / más sobre mí: ${CV_URL}
- GitHub: ${GITHUB_URL}
- LinkedIn: ${LINKEDIN_URL}
- Email: ${EMAIL}

---
Este mail se generó automáticamente porque pediste más info en ${SITE_URL}.`;

  return { subject, html, text };
}
