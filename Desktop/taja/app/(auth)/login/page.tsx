'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { validateLogin, saveCurrentUser } from '@/lib/auth';
import { useToast } from '@/contexts/ToastContext';

export default function LoginPage() {
    const router = useRouter();
    const { showToast } = useToast();
    const [userType, setUserType] = useState<'student' | 'teacher'>('student');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            let result: { success: boolean; user?: any; error?: string };

            if (userType === 'teacher') {
                // 교사: 관리자 번호만 검증
                result = await validateLogin('teacher', password);
            } else {
                // 학생: 아이디와 비밀번호 검증
                result = await validateLogin(email, password);
            }

            if (result.success && result.user) {
                saveCurrentUser(result.user);
                showToast(`환영합니다, ${result.user.username}님!`, 'success');
                setTimeout(() => {
                    router.push('/dashboard');
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
        <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#F5F0EB' }}>
            <div className="w-full max-w-6xl mx-auto px-8">
                <div className="bg-white rounded-3xl shadow-2xl overflow-hidden" style={{ display: 'flex' }}>
                    {/* 왼쪽: 로그인 폼 */}
                    <div style={{ flex: '1', padding: '4rem' }}>
                        <div className="max-w-md mx-auto">
                            {/* 헤더 */}
                            <div className="text-center mb-12">
                                <h1 className="text-5xl font-bold mb-3" style={{
                                    background: 'linear-gradient(135deg, #FF6B9D 0%, #4ECDC4 100%)',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent'
                                }}>
                                    타자왕국
                                </h1>
                                <p className="text-xl text-gray-600">
                                    초등학교 AI 타자 자료집
                                </p>
                            </div>

                            {/* 탭 */}
                            <div className="flex gap-4 mb-8">
                                <div
                                    onClick={() => setUserType('student')}
                                    className="flex-1 py-3 rounded-xl text-center font-bold text-lg cursor-pointer"
                                    style={{
                                        background: userType === 'student' ? 'linear-gradient(135deg, #FF6B9D 0%, #4ECDC4 100%)' : 'transparent',
                                        color: userType === 'student' ? 'white' : '#666',
                                        backgroundColor: userType === 'student' ? '' : '#F5F5F5'
                                    }}
                                >
                                    🎓 학생
                                </div>
                                <div
                                    onClick={() => setUserType('teacher')}
                                    className="flex-1 py-3 rounded-xl text-center font-bold text-lg cursor-pointer"
                                    style={{
                                        background: userType === 'teacher' ? 'linear-gradient(135deg, #FF6B9D 0%, #4ECDC4 100%)' : 'transparent',
                                        color: userType === 'teacher' ? 'white' : '#666',
                                        backgroundColor: userType === 'teacher' ? '' : '#F5F5F5'
                                    }}
                                >
                                    📚 교사
                                </div>
                            </div>

                            {/* 로그인 제목 */}
                            <h2 className="text-3xl font-bold text-center mb-8" style={{ color: '#333' }}>
                                {userType === 'student' ? '학생 로그인' : '교사 로그인'}
                            </h2>

                            {/* 폼 */}
                            <form onSubmit={handleLogin} className="space-y-6">
                                {userType === 'student' ? (
                                    <>
                                        <div>
                                            <label className="block text-lg font-bold mb-2" style={{ color: '#333' }}>
                                                아이디
                                            </label>
                                            <input
                                                type="text"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                className="w-full px-4 py-3 text-lg rounded-xl border-2 border-gray-300 
                              focus:outline-none focus:border-pink-400 transition-colors"
                                                placeholder="a1"
                                                required
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-lg font-bold mb-2" style={{ color: '#333' }}>
                                                비밀번호
                                            </label>
                                            <input
                                                type="password"
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                className="w-full px-4 py-3 text-lg rounded-xl border-2 border-gray-300 
                              focus:outline-none focus:border-pink-400 transition-colors"
                                                placeholder="1234"
                                                required
                                            />
                                        </div>
                                    </>
                                ) : (
                                    <div>
                                        <label className="block text-lg font-bold mb-2" style={{ color: '#333' }}>
                                            관리자 번호
                                        </label>
                                        <input
                                            type="password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            className="w-full px-4 py-3 text-lg rounded-xl border-2 border-gray-300 
                          focus:outline-none focus:border-pink-400 transition-colors"
                                            placeholder="관리자 번호를 입력하세요"
                                            required
                                        />
                                    </div>
                                )}

                                {error && (
                                    <div className="p-4 rounded-xl text-center bg-red-50 text-red-600 font-semibold">
                                        {error}
                                    </div>
                                )}

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full py-4 rounded-xl font-bold text-xl transition-all duration-200 hover:opacity-90"
                                    style={{
                                        background: 'linear-gradient(135deg, #FF6B9D 0%, #4ECDC4 100%)',
                                        color: 'white',
                                    }}
                                >
                                    로그인 →
                                </button>
                            </form>

                            {/* 회원가입 링크 */}
                            <div className="mt-6 text-center">
                                <p className="text-lg text-gray-600">
                                    계정이 없으신가요?{' '}
                                    <Link href="/signup" className="font-bold" style={{ color: '#4ECDC4' }}>
                                        회원가입
                                    </Link>
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* 오른쪽: 이미지 */}
                    <div style={{
                        flex: '1',
                        background: 'linear-gradient(135deg, #FFE5F0 0%, #E0F7FA 100%)',
                        padding: '4rem',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}>
                        <div className="text-center">
                            <h2 className="text-4xl font-bold mb-6" style={{
                                background: 'linear-gradient(135deg, #FF6B9D 0%, #4ECDC4 100%)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent'
                            }}>
                                Ingyu's AI World
                            </h2>
                            <img
                                src="/cute_typing_bear.png"
                                alt="Typing illustration"
                                style={{ width: '100%', maxWidth: '400px', margin: '0 auto' }}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
