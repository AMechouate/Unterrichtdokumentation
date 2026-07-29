import type { Metadata } from "next";
import { headers } from "next/headers";
import "./globals.css";

export async function generateMetadata(): Promise<Metadata> {
  const requestHeaders = await headers();
  const host = requestHeaders.get("x-forwarded-host") ?? requestHeaders.get("host");
  const protocol = requestHeaders.get("x-forwarded-proto") ?? "https";
  const origin = host ? `${protocol}://${host}` : "http://localhost:3000";
  const title = "Tertia Unterrichtsdokumentation";
  const description =
    "Ein klarer Tagesbericht für Unterricht, Lernfelder, ILIAS-Aufgaben und Teilnehmerbeobachtungen.";

  return {
    title: {
      default: title,
      template: "%s · Tertia",
    },
    description,
    openGraph: {
      title,
      description,
      type: "website",
      locale: "de_DE",
      images: [{ url: `${origin}/og.png`, width: 1731, height: 909, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [`${origin}/og.png`],
    },
  };
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="de">
      <body>{children}</body>
    </html>
  );
}
