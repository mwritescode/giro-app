import type { Metadata } from "next";
import "./globals.css";

const SITE_NAME = "giro.";
const DESCRIPTION =
  "Laboratori, musei e natura da vivere con i bambini a Firenze e Milano. Scopri, salva e prenota sul sito dell'organizzatore.";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.APP_URL ?? "http://localhost:3000"),
  title: {
    default: `${SITE_NAME} — Esperienze per bambini a Firenze e Milano`,
    template: `%s — ${SITE_NAME}`,
  },
  description: DESCRIPTION,
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    locale: "it_IT",
    title: `${SITE_NAME} — Esperienze per bambini a Firenze e Milano`,
    description: DESCRIPTION,
    images: [{ url: "/images/science.png", alt: SITE_NAME }],
  },
  twitter: {
    card: "summary_large_image",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="it">
      <body>{children}</body>
    </html>
  );
}
