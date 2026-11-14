type LoginEmail = {
  to: string;
  url: string;
};

export async function sendLoginEmail({ to, url }: LoginEmail): Promise<void> {
  console.log(
    ["", "── giro. · link di accesso (solo sviluppo) ──", `A: ${to}`, url, ""].join("\n"),
  );
}
