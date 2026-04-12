import './globals.css';

export const metadata = {
  title: 'FizikLab — Çetin Doğan',
  description: 'İnteraktif fizik simülasyonları — Çetin Doğan',
};

export default function RootLayout({ children }) {
  return (
    <html lang="tr">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body>{children}</body>
    </html>
  );
}
