import { ImageResponse } from 'next/og'

// Route segment config
export const runtime = 'edge'

// Image metadata
export const alt = '타자왕국 - 초등학생 한글 타자 연습'
export const size = {
  width: 1200,
  height: 630,
}
export const contentType = 'image/png'

// Image generation
export default async function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #FFB3D9 0%, #B3E5FC 30%, #FFF9C4 60%, #C8E6C9 100%)',
          padding: '80px',
        }}
      >
        {/* 메인 컨텐츠 카드 */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'rgba(255, 255, 255, 0.95)',
            borderRadius: '60px',
            padding: '80px 100px',
            boxShadow: '0 20px 60px rgba(93, 78, 109, 0.2)',
          }}
        >
          {/* 제목 */}
          <div
            style={{
              fontSize: 120,
              fontWeight: 900,
              color: '#5D4E6D',
              marginBottom: '30px',
              display: 'flex',
              alignItems: 'center',
              gap: '20px',
            }}
          >
            타자왕국 👑
          </div>

          {/* 부제 */}
          <div
            style={{
              fontSize: 48,
              color: '#8B7A9D',
              textAlign: 'center',
              marginBottom: '50px',
              lineHeight: 1.4,
            }}
          >
            AI와 함께하는 초등학생<br />한글 타자 연습
          </div>

          {/* 아이콘들 */}
          <div
            style={{
              display: 'flex',
              gap: '40px',
              fontSize: 80,
            }}
          >
            <span>⌨️</span>
            <span>📝</span>
            <span>🎮</span>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  )
}
