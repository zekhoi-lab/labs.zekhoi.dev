import { ImageResponse } from 'next/og'

export const alt = 'Labs by zekhoi - Developer Tools'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

// Generated at build time; used as og:image (and by X as the card image)
export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: 72,
          background: '#000',
          color: '#fff',
          border: '2px solid #fff',
          fontFamily: 'monospace',
        }}
      >
        <div style={{ display: 'flex', fontSize: 28, letterSpacing: 6, textTransform: 'uppercase', color: '#9ca3af' }}>
          labs.zekhoi.dev
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          <div style={{ display: 'flex', fontSize: 96, fontWeight: 700, letterSpacing: -2, textTransform: 'uppercase' }}>
            Developer Tools
          </div>
          <div style={{ display: 'flex', fontSize: 32, color: '#d1d5db' }}>
            Fast, private utilities that run in your browser. No ads, no tracking.
          </div>
        </div>
        <div style={{ display: 'flex', gap: 16, fontSize: 24, color: '#9ca3af' }}>
          {['UUID', 'JSON', 'JWT', 'Base64', 'Regex', 'Hash', 'Cron'].map((tool) => (
            <div key={tool} style={{ display: 'flex', border: '1px solid #4b5563', padding: '8px 16px' }}>
              {tool}
            </div>
          ))}
        </div>
      </div>
    ),
    size
  )
}
