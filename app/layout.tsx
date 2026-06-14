import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Rosso Mania — Il marketplace delle Ferrari d'epoca",
  description: "Vetture certificate, schede ufficiali dei modelli e valutazione AI.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="it">
      <body>{children}</body>
    </html>
  );
}