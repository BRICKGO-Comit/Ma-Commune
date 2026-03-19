import './globals.css';

export const metadata = {
  title: 'MA COMMUNE — Administration',
  description: 'Dashboard d\'administration pour la plateforme MA COMMUNE',
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}
