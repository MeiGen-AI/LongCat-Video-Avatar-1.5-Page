import './globals.css';
import type { Metadata } from 'next';
import Providers from '../components/providers';
export const metadata: Metadata = {
  title: 'Fakhm Studio | AI Avatar Video',
  description: 'Turn one image and one voice into a cinematic avatar video.',
  openGraph: { title: 'Fakhm Studio', description: 'Give your voice a face.', type: 'website' },
  twitter: {
    card: 'summary_large_image',
    title: 'Fakhm Studio',
    description: 'Give your voice a face.',
  },
};
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `document.documentElement.classList.toggle('dark',localStorage.getItem('fakhm-theme')!=='light')`,
          }}
        />
      </head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
