import Link from 'next/link'

export default function NotFound() {
  return (
    <html>
      <body>
        <div style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#0a0a0a',
          color: 'white'
        }}>
          <h1 style={{ fontSize: 20, marginBottom: 12 }}>Page not found</h1>
          <p style={{ color: '#9ca3af', marginBottom: 16 }}>The page you requested does not exist.</p>
          <Link href="/" style={{ color: '#f97316' }}>Go back home</Link>
        </div>
      </body>
    </html>
  )
}

