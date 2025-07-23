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
        <title>Boxoal</title>
      </head>
      <body>{children}</body>
    </html>
  )
}
