import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Toaster } from "sonner";
import { AuthProvider } from "@/lib/auth-context";

export const metadata: Metadata = {
  title: "CineGen — AI Content Creator Marketplace",
  description:
    "Connect with AI filmmakers, animators, and generative artists. Discover, brief, and hire the world's best AI content creators.",
  keywords: "AI content, AI filmmaker, generative art, brand content, AI marketplace",
  openGraph: {
    title: "CineGen — AI Content Creator Marketplace",
    description: "The platform for AI-native creative work.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Playfair+Display:ital,wght@0,700;0,800;1,700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen flex flex-col" style={{ background: "var(--cream)" }}>
        <AuthProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
          <Toaster
            position="bottom-right"
            toastOptions={{
              style: {
                background: "hsl(240 8% 10%)",
                color: "hsl(0 0% 95%)",
                border: "1px solid hsl(240 6% 20%)",
              },
            }}
          />
        </AuthProvider>
      </body>
    </html>
  );
}
