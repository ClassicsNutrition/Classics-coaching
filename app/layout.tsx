import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Classics Coaching | Coaching Personnalisé par Smain Chebab',
  description: 'Plateforme de coaching bien-être et sportif de Smain Chebab, fondateur de Classics Nutrition. Programmes personnalisés, e-books experts et compléments alimentaires.',
  keywords: ['coaching', 'bien-être', 'nutrition', 'sport', 'classics nutrition', 'Smain Chebab'],
  icons: {
    icon: '/logo.png',
    apple: '/logo.png',
  },
  openGraph: {
    title: 'Classics Coaching',
    description: 'Votre coaching personnalisé par Smain Chebab',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      </head>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
