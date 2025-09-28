import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Evaluación del Nivel de Madurez ISO 42001 - Sistema de Gestión de IA",
  description: "Herramienta interactiva para evaluar el nivel de madurez de su organización en la implementación de sistemas de gestión de inteligencia artificial según la norma ISO 42001.",
  keywords: ["ISO 42001", "Gestión de IA", "Inteligencia Artificial", "Evaluación de Madurez", "Sistema de Gestión", "Norma ISO"],
  authors: [{ name: "ISO 42001 Assessment Tool" }],
  openGraph: {
    title: "Evaluación del Nivel de Madurez ISO 42001",
    description: "Evalúe la madurez de su organización en sistemas de gestión de IA",
    url: "https://chat.z.ai",
    siteName: "ISO 42001 Assessment Tool",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Evaluación del Nivel de Madurez ISO 42001",
    description: "Herramienta de evaluación para sistemas de gestión de IA",
  },
  icons: {
    icon: "/favicon.png",
    apple: "/favicon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
