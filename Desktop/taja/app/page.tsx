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

        {/* 버튼 (포털형 UI) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 justify-center items-center w-full max-w-4xl mx-auto">
          {/* 학생 포털 */}
          <div
            onClick={() => {
              const userStr = localStorage.getItem('current_user');
              const user = userStr ? JSON.parse(userStr) : null;
              if (user && user.role === 'student') {
                router.push('/dashboard');
              } else {
                router.push('/login?type=student');
              }
            }}
            className="group relative bg-white rounded-3xl p-10 shadow-xl hover:shadow-2xl transition-all cursor-pointer transform hover:-translate-y-2 border-4 border-transparent hover:border-pink-300"
          >
            <div className="text-7xl mb-6 group-hover:scale-110 transition-transform">🎓</div>
            <h2 className="text-3xl font-bold mb-2 text-gray-800">학생 시작하기</h2>
            <p className="text-lg text-gray-500 mb-6 font-medium">재미있는 타자 연습과 AI 동화 만들기!</p>
            <div className="py-4 px-8 rounded-2xl font-bold text-xl text-white shadow-md inline-block"
              style={{ background: 'linear-gradient(135deg, #FF6B9D 0%, #FFA8C5 100%)' }}>
              입장하기 →
            </div>
          </div>

          {/* 교사 포털 */}
          <div
            onClick={() => {
              const userStr = localStorage.getItem('current_user');
              const user = userStr ? JSON.parse(userStr) : null;
              if (user && user.role === 'teacher') {
                router.push('/dashboard');
              } else {
                router.push('/login?type=teacher');
              }
            }}
            className="group relative bg-white rounded-3xl p-10 shadow-xl hover:shadow-2xl transition-all cursor-pointer transform hover:-translate-y-2 border-4 border-transparent hover:border-cyan-300"
          >
            <div className="text-7xl mb-6 group-hover:scale-110 transition-transform">👨‍🏫</div>
            <h2 className="text-3xl font-bold mb-2 text-gray-800">교사 대시보드</h2>
            <p className="text-lg text-gray-500 mb-6 font-medium">학생들의 학습 현황을 한눈에 관리하세요!</p>
            <div className="py-4 px-8 rounded-2xl font-bold text-xl text-white shadow-md inline-block"
              style={{ background: 'linear-gradient(135deg, #4ECDC4 0%, #A5D6A7 100%)' }}>
              관리자 모드 →
            </div>
          </div>
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
