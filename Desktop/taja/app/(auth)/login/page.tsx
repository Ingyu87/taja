'use client';

import { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { validateLogin, saveCurrentUser } from '@/lib/auth';
import { useToast } from '@/contexts/ToastContext';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

function LoginContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { showToast } = useToast();

    // URL 파라미터에서 타입 가져오기
    const initialType = searchParams?.get('type') === 'teacher' ? 'teacher' : 'student';

    const [userType, setUserType] = useState<'student' | 'teacher'>(initialType);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // 이미 로그인된 상태라면 대시보드로 이동
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const user = localStorage.getItem('current_user');
            if (user) {
                router.replace('/dashboard');
            }
        }
    }, [router]);

    // URL 파라미터가 변경되면 타입 업데이트
    useEffect(() => {
        const type = searchParams?.get('type');
        if (type === 'teacher' || type === 'student') {
            setUserType(type);
        }
    }, [searchParams]);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            let result: { success: boolean; user?: any; error?: string };

            if (userType === 'teacher') {
                // 교사: 관리자 번호만 검증
                result = await validateLogin('teacher', password, 'teacher');
            } else {
                // 학생: 아이디와 비밀번호 검증
                result = await validateLogin(email, password, 'student');
            }

            if (result.success && result.user) {
                saveCurrentUser(result.user);
                showToast(`환영합니다, ${result.user.username}님!`, 'success');
                setTimeout(() => {
                    router.replace('/dashboard');
                }, 500);
            } else {
                const msg = result.error || '로그인에 실패했습니다.';
                setError(msg);
                showToast(msg, 'error');
                setLoading(false);
            }
        } catch (err: any) {
            console.error(err); // 린트 에러 방지용 로깅
            const msg = err.message || '로그인에 실패했습니다.';
            setError(msg);
            showToast(msg, 'error');
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-12" style={{ backgroundColor: '#F5F0EB' }}>
            <div className="w-full max-w-[1800px] mx-auto">
                <div className="bg-white shadow-2xl overflow-hidden" style={{ borderRadius: '60px', padding: '6rem' }}>
                    {/* 로그인 폼 */}
                    <div className="max-w-[1400px] mx-auto">
                        {/* 헤더 */}
                        <div className="text-center mb-20">
                            <h1 className="font-bold mb-6" style={{
                                background: 'linear-gradient(135deg, #FF6B9D 0%, #4ECDC4 100%)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                fontSize: '12rem',
                                lineHeight: '1'
                            }}>
                                타자왕국
                            </h1>
                            <p className="font-semibold text-gray-600" style={{ fontSize: '5rem' }}>
                                초등학교 AI 타자 자료집
                            </p>
                        </div>

                        {/* 탭 */}
                        <div className="flex gap-8 mb-16">
                            <div
                                onClick={() => setUserType('student')}
                                className="flex-1 text-center font-black cursor-pointer hover:scale-105 transition-transform"
                                style={{
                                    borderRadius: '40px',
                                    background: userType === 'student' ? 'linear-gradient(135deg, #FF6B9D 0%, #4ECDC4 100%)' : '#F5F5F5',
                                    color: userType === 'student' ? 'white' : '#666',
                                    padding: '3rem 0',
                                    fontSize: '6rem'
                                }}
                            >
                                🎓 학생
                            </div>
                            <div
                                onClick={() => setUserType('teacher')}
                                className="flex-1 text-center font-black cursor-pointer hover:scale-105 transition-transform"
                                style={{
                                    borderRadius: '40px',
                                    background: userType === 'teacher' ? 'linear-gradient(135deg, #FF6B9D 0%, #4ECDC4 100%)' : '#F5F5F5',
                                    color: userType === 'teacher' ? 'white' : '#666',
                                    padding: '3rem 0',
                                    fontSize: '6rem'
                                }}
                            >
                                📚 교사
                            </div>
                        </div>

                        {/* 로그인 제목 */}
                        <h2 className="font-black text-center mb-16" style={{ color: '#333', fontSize: '8rem' }}>
                            {userType === 'student' ? '학생 로그인' : '교사 로그인'}
                        </h2>

                        {/* 폼 */}
                        <form onSubmit={handleLogin} className="space-y-20 flex flex-col items-center">
                            {userType === 'student' ? (
                                <>
                                    <div className="w-full">
                                        <label className="block font-black mb-10 text-left" style={{ color: '#333', fontSize: '7rem' }}>
                                            아이디 <span className="font-normal text-gray-500 ml-6" style={{ fontSize: '4rem' }}>(a1 ~ a30)</span>
                                        </label>
                                        <input
                                            type="text"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value.trim())}
                                            className="w-full px-16 rounded-[60px] border-8 border-gray-300 
                               focus:outline-none focus:border-pink-400 transition-colors shadow-2xl text-center font-black tracking-widest"
                                            style={{ height: '220px', fontSize: '10rem' }}
                                            required
                                        />
                                    </div>

                                    <div className="w-full">
                                        <label className="block font-black mb-10 text-left" style={{ color: '#333', fontSize: '7rem' }}>
                                            비밀번호
                                        </label>
                                        <input
                                            type="password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value.trim())}
                                            className="w-full px-16 rounded-[60px] border-8 border-gray-300 
                               focus:outline-none focus:border-pink-400 transition-colors shadow-2xl text-center font-black tracking-widest"
                                            style={{ height: '220px', fontSize: '10rem' }}
                                            required
                                        />
                                    </div>
                                </>
                            ) : (
                                <div className="w-full">
                                    <label className="block font-black mb-10 text-left" style={{ color: '#333', fontSize: '7rem' }}>
                                        관리자 번호
                                    </label>
                                    <input
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value.trim())}
                                        className="w-full px-16 rounded-[60px] border-8 border-gray-300 
                          focus:outline-none focus:border-pink-400 transition-colors shadow-2xl text-center font-black tracking-widest"
                                        style={{ height: '220px', fontSize: '10rem' }}
                                        required
                                    />
                                </div>
                            )}

                            {error && (
                                <div className="w-full p-12 rounded-[40px] text-center bg-red-50 text-red-600 font-black border-4 border-red-200" style={{ fontSize: '5rem' }}>
                                    {error}
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full rounded-[60px] font-black transition-all duration-200 hover:opacity-90 transform hover:scale-105 shadow-2xl active:scale-95 mt-12"
                                style={{
                                    background: 'linear-gradient(135deg, #FF6B9D 0%, #4ECDC4 100%)',
                                    color: 'white',
                                    padding: '4rem 0',
                                    fontSize: '8rem'
                                }}
                            >
                                로그인 하기 →
                            </button>
                        </form>

                        {/* 회원가입 링크 제거됨 */}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function LoginPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-[#F5F0EB]"><LoadingSpinner /></div>}>
            <LoginContent />
        </Suspense>
    );
}
