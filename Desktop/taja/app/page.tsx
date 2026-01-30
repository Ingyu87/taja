'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';

export default function Home() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-8 py-16"
      style={{ backgroundColor: 'var(--color-bg)' }}>
      <div className="text-center max-w-6xl mx-auto space-y-16 fade-in">
        {/* 메인 타이틀 */}
        <div>
          <div className="text-9xl mb-8 bounce">🏰</div>
          <h1 className="text-8xl font-bold mb-8" style={{ color: 'var(--color-primary)' }}>
            타자왕국
          </h1>
          <p className="text-4xl font-medium mb-6" style={{ color: 'var(--color-text)' }}>
            AI와 함께하는 재미있는 한글 타자 연습
          </p>
          <p className="text-2xl text-gray-600 leading-relaxed max-w-3xl mx-auto">
            동화, 시, 게임으로 즐겁게 배우는 타자 연습! <br />
            친구들과 경쟁하고 멋진 배지도 모아보세요 ✨
          </p>
        </div>

        {/* 버튼 */}
        <div className="flex gap-8 justify-center">
          <Button
            variant="primary"
            size="lg"
            onClick={() => router.push('/login')}
            className="text-3xl px-16 py-10"
          >
            로그인 🚀
          </Button>
          <Button
            variant="secondary"
            size="lg"
            onClick={() => router.push('/signup')}
            className="text-3xl px-16 py-10"
          >
            회원가입 ✨
          </Button>
        </div>

        {/* 기능 소개 카드 */}
        <div className="grid grid-cols-3 gap-12 max-w-6xl mx-auto mt-20">
          <div className="bg-white rounded-3xl p-12 shadow-xl hover:shadow-2xl transition-shadow">
            <div className="text-8xl mb-6">📚</div>
            <h3 className="font-bold text-3xl mb-6" style={{ color: 'var(--color-text)' }}>
              단계별 연습
            </h3>
            <p className="text-2xl text-gray-600 leading-relaxed">
              모음, 자음부터<br />
              문장까지 차근차근
            </p>
          </div>

          <div className="bg-white rounded-3xl p-12 shadow-xl hover:shadow-2xl transition-shadow">
            <div className="text-8xl mb-6">🎮</div>
            <h3 className="font-bold text-3xl mb-6" style={{ color: 'var(--color-text)' }}>
              재미있는 게임
            </h3>
            <p className="text-2xl text-gray-600 leading-relaxed">
              5가지 타자 게임으로<br />
              즐겁게 연습
            </p>
          </div>

          <div className="bg-white rounded-3xl p-12 shadow-xl hover:shadow-2xl transition-shadow">
            <div className="text-8xl mb-6">🤖</div>
            <h3 className="font-bold text-3xl mb-6" style={{ color: 'var(--color-text)' }}>
              AI 스토리
            </h3>
            <p className="text-2xl text-gray-600 leading-relaxed">
              내가 원하는 주제로<br />
              AI가 글 생성
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
