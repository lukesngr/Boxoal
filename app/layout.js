import './globals.css'
import { Inter } from 'next/font/google'
import localFont from 'next/font/local';

const inter = Inter({ subsets: ['latin'] })


export const metadata = {
  title: 'Boxoal',
  description: 'Timeboxing software for the everyman',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com"></link>
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin></link>
        <link href="https://fonts.googleapis.com/css2?family=Lato&display=swap" rel="stylesheet"></link>
        <link href="https://fonts.googleapis.com/css2?family=Roboto&display=swap" rel="stylesheet"></link>
        <title>Boxoal</title>
      </head>
      <body className={`${inter.className} `}>{children}</body>
    </html>
  )
}
