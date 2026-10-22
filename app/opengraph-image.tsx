import { ImageResponse } from 'next/og';
import { profile } from '@/data/profile';

export const alt = profile.name;
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

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
          background: '#05060A',
          color: '#C9D3E0',
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{ display: 'flex', fontSize: 22, letterSpacing: 6, color: '#00F0FF' }}>
          LATENT SPACE / {profile.name.toUpperCase()}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ fontSize: 84, fontWeight: 700, color: '#FFFFFF', lineHeight: 1.05 }}>{profile.headline}</div>
          <div style={{ marginTop: 28, fontSize: 28, color: '#FFB800' }}>Data Science · AI/ML Engineering · AI Systems</div>
        </div>
        <div style={{ display: 'flex', fontSize: 20, color: '#6B7689' }}>{profile.location} · pareshsubedi.com.np</div>
      </div>
    ),
    size,
  );
}
