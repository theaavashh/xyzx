import { Inter, Lexend, Mona_Sans, Montserrat, Plus_Jakarta_Sans, Public_Sans } from 'next/font/google';
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

export const keynord = localFont({
  src: '../../public/font/TTF/Keynord-Regular.otf',
  display: 'swap',
});
