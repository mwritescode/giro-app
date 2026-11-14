import { getCloudflareContext } from "@opennextjs/cloudflare";

type LoginEmail = {
  to: string;
  url: string;
};

function envValue(name: string): string | undefined {
  if (process.env[name]) {
    return process.env[name];
  }

  try {
    const { env } = getCloudflareContext() as unknown as {
      env: Record<string, string | undefined>;
    };
    return env[name];
  } catch {
    return undefined;
  }
}

function content(url: string): { html: string; text: string } {
  return {
    html: `
      <div style="font-family:Arial,Helvetica,sans-serif;color:#17243d;line-height:1.6">
        <p style="font-size:22px;font-weight:700;margin:0 0 18px">giro<span style="color:#2857eb">.</span></p>
        <p>Ecco il tuo link per accedere a Giro.</p>
        <p style="margin:22px 0">
          <a href="${url}" style="background:#2857eb;color:#fff;padding:13px 20px;border-radius:999px;text-decoration:none;font-weight:600">
            Accedi a Giro
          </a>
        </p>
        <p style="color:#6a7180;font-size:13px">
          Il link è valido per 15 minuti e può essere usato una sola volta.
          Se non hai chiesto tu l'accesso, ignora questa email.
        </p>
      </div>
    `,
    text: `Ecco il tuo link per accedere a Giro:\n\n${url}\n\nIl link è valido per 15 minuti e può essere usato una sola volta.`,
  };
}

const SUBJECT = "Il tuo link di accesso a Giro";

async function sendWithResend(apiKey: string, to: string, url: string): Promise<void> {
  const from = envValue("RESEND_FROM") ?? "Giro <onboarding@resend.dev>";
  const { html, text } = content(url);

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({ from, to, subject: SUBJECT, html, text }),
  });

  if (!response.ok) {
    throw new Error(`Resend ha risposto ${response.status}: ${await response.text()}`);
  }
}

async function sendWithBrevo(apiKey: string, to: string, url: string): Promise<void> {
  const senderEmail = envValue("BREVO_SENDER") ?? "martina.rossini704@gmail.com";
  const { html, text } = content(url);

  const response = await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: { "api-key": apiKey, "Content-Type": "application/json" },
    body: JSON.stringify({
      sender: { email: senderEmail, name: "Giro" },
      to: [{ email: to }],
      subject: SUBJECT,
      htmlContent: html,
      textContent: text,
    }),
  });

  if (!response.ok) {
    throw new Error(`Brevo ha risposto ${response.status}: ${await response.text()}`);
  }
}

export async function sendLoginEmail({ to, url }: LoginEmail): Promise<void> {
  const resendKey = envValue("RESEND_API_KEY");
  if (resendKey) {
    await sendWithResend(resendKey, to, url);
    return;
  }

  const brevoKey = envValue("BREVO_API_KEY");
  if (brevoKey) {
    await sendWithBrevo(brevoKey, to, url);
    return;
  }

  console.log(
    ["", "── giro. · link di accesso (solo sviluppo) ──", `A: ${to}`, url, ""].join("\n"),
  );
}
