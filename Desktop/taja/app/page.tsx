'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';

export default function Home() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8"
      style={{ backgroundColor: 'var(--color-bg)' }}>
      <div className="text-center max-w-7xl mx-auto flex flex-col gap-16 fade-in w-full">
        {/* 메인 타이틀 */}
        <div className="space-y-6">
          <div className="text-8xl mb-6 bounce">🏰</div>
          <h1 className="text-6xl md:text-8xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-400 to-purple-500"
            style={{ paddingBottom: '0.1em' }}>
            타자왕국
          </h1>
          <p className="text-2xl md:text-3xl font-medium text-gray-700">
            AI와 함께하는 재미있는 한글 타자 연습
          </p>
          <p className="text-xl text-gray-500 leading-relaxed max-w-2xl mx-auto">
            동화, 시, 게임으로 즐겁게 배우는 타자 연습! <br className="hidden md:block" />
            친구들과 경쟁하고 멋진 배지도 모아보세요 ✨
          </p>
        </div>

        {/* 버튼 */}
        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center w-full">
          <Button
            variant="primary"
            size="lg"
            onClick={() => router.push('/login')}
            className="text-xl md:text-2xl px-12 py-8 w-full sm:w-auto shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all"
          >
            로그인 🚀
          </Button>
          <Button
            variant="secondary"
            size="lg"
            onClick={() => router.push('/signup')}
            className="text-xl md:text-2xl px-12 py-8 w-full sm:w-auto shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all"
          >
            회원가입 ✨
          </Button>
        </div>

        {/* 기능 소개 카드 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8 w-full">
          <div className="bg-white/80 backdrop-blur rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all hover:-translate-y-2 border border-white/50">
            <div className="text-6xl mb-6 bg-green-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto">📚</div>
            <h3 className="font-bold text-2xl mb-4 text-gray-800">
              단계별 연습
            </h3>
            <p className="text-lg text-gray-600 leading-relaxed">
              모음, 자음부터<br />
              문장까지 차근차근
            </p>
          </div>

          <div className="bg-white/80 backdrop-blur rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all hover:-translate-y-2 border border-white/50">
            <div className="text-6xl mb-6 bg-blue-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto">🎮</div>
            <h3 className="font-bold text-2xl mb-4 text-gray-800">
              재미있는 게임
            </h3>
            <p className="text-lg text-gray-600 leading-relaxed">
              5가지 타자 게임으로<br />
              즐겁게 연습
            </p>
          </div>

          <div className="bg-white/80 backdrop-blur rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all hover:-translate-y-2 border border-white/50">
            <div className="text-6xl mb-6 bg-purple-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto">🤖</div>
            <h3 className="font-bold text-2xl mb-4 text-gray-800">
              AI 스토리
            </h3>
            <p className="text-lg text-gray-600 leading-relaxed">
              내가 원하는 주제로<br />
              AI가 글 생성
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
