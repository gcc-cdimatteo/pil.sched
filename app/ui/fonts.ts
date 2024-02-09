import { Inter } from 'next/font/google';
import { Lora } from 'next/font/google';
import { Lusitana } from 'next/font/google';

export const inter = Inter({ subsets: ['latin'] });
export const lora = Lora({ subsets: ['latin'] });
export const lusitana = Lusitana({
    subsets: ['latin'],
    weight: ['400', '700']
});