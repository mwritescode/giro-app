import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "giro. — Esperienze per bambini a Firenze e Milano",
  description:
    "Laboratori, musei e natura da vivere con i bambini a Firenze e Milano. Scopri, salva e prenota sul sito dell'organizzatore.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="it">
      <body>{children}</body>
    </html>
  );
}
