import type { Metadata } from 'next';
import './globals.css';
import PushNotificationManager from '@/components/PushNotificationManager';

export const metadata: Metadata = {
  title: 'Classics Coaching | Coaching Personnalisé par Smain Chebab',
  description: 'Plateforme de coaching bien-être et sportif de Smain Chebab, fondateur de Classics Nutrition. Programmes personnalisés, e-books experts et compléments alimentaires.',
  keywords: ['coaching', 'bien-être', 'nutrition', 'sport', 'classics nutrition', 'Smain Chebab'],
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Classics Coaching',
  },
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
        <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Space+Grotesk:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="Classics Coaching" />
      </head>
      <body className="antialiased">
        {children}
        <PushNotificationManager />
      </body>
    </html>
  );
}
