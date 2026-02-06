// app/layout.jsx
import { Roboto_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import Menu from "./components/Menu"; // Importa il componente Menu
import Footer from "./components/Footer"; // Importa il componente Footer
import { createClient } from "@/prismicio"; // Importa createClient
import { ThemeProvider } from "./components/ThemeProvider";
import {
  defaultDescription,
  defaultKeywords,
  defaultTitle,
  siteUrl,
} from "./seoConfig";

const robotoMono = Roboto_Mono({
  variable: "--font-roboto-mono",
  subsets: ["latin"],
});

export const metadata = {
  metadataBase: new URL(siteUrl),
  title: defaultTitle,
  description: defaultDescription,
  keywords: defaultKeywords,
  applicationName: "Pietro Franchitti",
  category: "technology",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: defaultTitle,
    description: defaultDescription,
    url: siteUrl,
    siteName: "Pietro Franchitti",
    locale: "it_IT",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: defaultTitle,
    description: defaultDescription,
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default async function RootLayout({ children }) {
  const client = createClient();
  const menuResponse = await client.getByType("menu");
  const footerResponse = await client.getByType("impostazioni");

  const menuData = menuResponse?.results[0]?.data?.slices?.find(
    (slice) => slice.slice_type === "link_menu"
  );

  const footerData = footerResponse?.results[0]?.data?.slices?.find(
    (slice) => slice.slice_type === "footer"
  );

  const personJsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Pietro Franchitti",
    jobTitle: "Frontend Developer",
    url: siteUrl,
    address: {
      "@type": "PostalAddress",
      addressLocality: "Torino",
      addressRegion: "Piemonte",
      addressCountry: "IT",
    },
    knowsAbout: [
      "frontend development",
      "Next.js",
      "UI design",
      "performance web",
      "design system",
    ],
    sameAs: [siteUrl],
  };

  return (
    <html lang="it">
      <body className={`${robotoMono.variable} font-roboto-mono antialiased relative`}>
        <ThemeProvider>
        <Script
          id="structured-data-person"
          type="application/ld+json"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />

        <Menu menu={menuData} />
        {children}
        <Footer footerData={footerData} />
        </ThemeProvider>
      </body>
    </html>
  );
}
