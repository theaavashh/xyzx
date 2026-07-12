import { Inter, Lexend, Mona_Sans, Montserrat, Playfair_Display, Plus_Jakarta_Sans, Public_Sans } from 'next/font/google';
import localFont from 'next/font/local';

export const inter = Mona_Sans({
  subsets: ['latin'],
  weight: ['400', '700'],
  display: 'swap',
});

export const poppins = Montserrat({
  weight: ['400', '700', '800', '900'],
  subsets: ['latin'],
  display: 'swap',
});

export const playfair = Playfair_Display({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
  variable: '--font-playfair',
});

export const keynord = localFont({
  src: '../../public/font/TTF/Keynord-Regular.otf',
  display: 'swap',
});
