import type { Metadata } from 'next';
import { Barlow_Condensed, DM_Sans, Lora } from 'next/font/google';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import './globals.css';

const barlowCondensed = Barlow_Condensed({
  subsets: ['latin'],
  weight: ['700', '800'],
  variable: '--font-barlow-condensed',
});

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-dm-sans',
});

const lora = Lora({
  subsets: ['latin'],
  style: ['italic'],
  weight: ['400', '500'],
  variable: '--font-lora',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://www.jorgereyesloja.ec'),
  title: 'Jorge Reyes Jaramillo | Candidato a Alcalde Loja 2026 — MASS 115',
  description: 'Descubre las propuestas de Jorge Reyes Jaramillo, candidato a Alcaldía de Loja 2026. Energía solar, internet gratis y la experiencia de quien ya transformó la ciudad.',
  keywords: 'Jorge Reyes Jaramillo Loja, Candidatos alcalde Loja 2026, Jorge Reyes candidato Loja, Propuestas alcaldía Loja 2026, propuestas para Loja',
  alternates: {
    canonical: 'https://www.jorgereyesloja.ec',
  },
  openGraph: {
    title: 'Jorge Reyes | Candidato Alcalde Loja 2026 — MASS 115',
    description: 'Jorge Reyes, candidato a Alcalde de Loja 2026 por el MASS 115.',
    url: 'https://www.jorgereyesloja.ec',
    siteName: 'Jorge Reyes 2026',
    images: [
      {
        url: '/images/og-jorge-reyes.webp',
        width: 1200,
        height: 630,
        alt: 'Jorge Reyes - Loja Autosuficiente',
      },
    ],
    locale: 'es_EC',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    images: ['/images/og-jorge-reyes.webp'],
  },
};

const personSchema = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: 'Jorge Reyes',
  jobTitle: 'Candidato a Alcalde de Loja 2026',
  affiliation: {
    '@type': 'Organization',
    name: 'Movimiento Acción Social Solidaria',
    alternateName: 'MASS 115',
    url: 'https://www.jorgereyesloja.ec',
  },
  knowsAbout: [
    'Administración pública',
    'Salud pública',
    'Energía solar',
    'Tecnología urbana',
    'Educación médica',
  ],
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Sucre y Rocafuerte Esq.',
    addressLocality: 'Loja',
    addressCountry: 'EC',
  },
  telephone: '+593997755478',
  sameAs: [
    'https://www.facebook.com/jorgereyesjaramillo',
    'https://www.instagram.com/jorgereyesjaramillo',
  ],
};

const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'PoliticalParty',
  name: 'Movimiento Acción Social Solidaria',
  alternateName: 'MASS 115',
  url: 'https://www.jorgereyesloja.ec',
  logo: 'https://www.jorgereyesloja.ec/images/logo-mass115.webp',
  contactPoint: {
    '@type': 'ContactPoint',
    telephone: '+593997755478',
    contactType: 'Contacto de campaña',
    availableLanguage: 'Spanish',
  },
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Sucre y Rocafuerte Esq.',
    addressLocality: 'Loja',
    addressCountry: 'EC',
  },
  sameAs: [
    'https://www.facebook.com/mass115loja',
    'https://www.instagram.com/mass115loja',
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${barlowCondensed.variable} ${dmSans.variable} ${lora.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
      </head>
      <body className="min-h-screen flex flex-col bg-light selection:bg-acento/30">
        <Header />
        <main className="flex-grow">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
