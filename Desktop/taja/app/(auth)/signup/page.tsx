'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { registerStudent, AVATARS } from '@/lib/auth';
import { useToast } from '@/contexts/ToastContext';

export default function SignupPage() {
    const router = useRouter();
    const { showToast } = useToast();
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        passwordConfirm: '',
        avatar: AVATARS[0].id,
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (formData.password !== formData.passwordConfirm) {
            const msg = '비밀번호가 일치하지 않습니다.';
            setError(msg);
            showToast(msg, 'error');
            return;
        }

        setError('');
        setLoading(true);

        try {
            const result = await registerStudent(formData.username, formData.password, formData.avatar);

            if (result.success) {
                showToast('회원가입 성공! 로그인해주세요.', 'success');
                setTimeout(() => {
                    router.push('/login');
                }, 500);
            } else {
                const msg = result.error || '회원가입에 실패했습니다.';
                setError(msg);
                showToast(msg, 'error');
                setLoading(false);
            }
        } catch (err: any) {
            const msg = err.message || '회원가입에 실패했습니다.';
            setError(msg);
            showToast(msg, 'error');
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#F5F0EB' }}>
            <div className="w-full max-w-6xl mx-auto px-8">
                <div className="bg-white rounded-3xl shadow-2xl overflow-hidden" style={{ display: 'flex' }}>
                    {/* 왼쪽: 회원가입 폼 */}
                    <div style={{ flex: '1', padding: '4rem' }}>
                        <div className="max-w-md mx-auto">
                            {/* 헤더 */}
                            <div className="text-center mb-10">
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

                            {/* 회원가입 제목 */}
                            <h2 className="text-3xl font-bold text-center mb-6" style={{ color: '#333' }}>
                                학생 회원가입
                            </h2>
                            <p className="text-center text-gray-600 mb-6">
                                학생 계정 (a1~a30)만 가입 가능합니다
                            </p>

                            {/* 폼 */}
                            <form onSubmit={handleSubmit} className="space-y-5">
                                {/* 아바타 선택 */}
                                <div>
                                    <label className="block text-lg font-bold mb-3" style={{ color: '#333' }}>
                                        캐릭터 선택
                                    </label>
                                    <div className="grid grid-cols-3 gap-3">
                                        {AVATARS.map((avatar) => (
                                            <button
                                                key={avatar.id}
                                                type="button"
                                                onClick={() => setFormData({ ...formData, avatar: avatar.id })}
                                                className={`p-3 rounded-xl border-2 transition-all ${formData.avatar === avatar.id
                                                    ? 'scale-105'
                                                    : 'opacity-60 hover:opacity-100'
                                                    }`}
                                                style={{
                                                    borderColor: formData.avatar === avatar.id ? '#FF6B9D' : '#E0E0E0',
                                                    backgroundColor: formData.avatar === avatar.id ? '#FFE5F0' : '#F5F5F5',
                                                }}
                                            >
                                                <div className="text-4xl mb-1">{avatar.emoji}</div>
                                                <div className="text-sm font-bold" style={{ color: '#333' }}>
                                                    {avatar.name}
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-lg font-bold mb-2" style={{ color: '#333' }}>
                                        아이디
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.username}
                                        onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                        className="w-full px-4 py-3 text-lg rounded-xl border-2 border-gray-300 
                      focus:outline-none focus:border-pink-400 transition-colors"
                                        placeholder="student1"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-lg font-bold mb-2" style={{ color: '#333' }}>
                                        비밀번호
                                    </label>
                                    <input
                                        type="password"
                                        value={formData.password}
                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                        className="w-full px-4 py-3 text-lg rounded-xl border-2 border-gray-300 
                      focus:outline-none focus:border-pink-400 transition-colors"
                                        placeholder="········"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-lg font-bold mb-2" style={{ color: '#333' }}>
                                        비밀번호 확인
                                    </label>
                                    <input
                                        type="password"
                                        value={formData.passwordConfirm}
                                        onChange={(e) => setFormData({ ...formData, passwordConfirm: e.target.value })}
                                        className="w-full px-4 py-3 text-lg rounded-xl border-2 border-gray-300 
                      focus:outline-none focus:border-pink-400 transition-colors"
                                        placeholder="········"
                                        required
                                    />
                                </div>

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
                                    회원가입 →
                                </button>
                            </form>

                            {/* 로그인 링크 */}
                            <div className="mt-6 text-center">
                                <p className="text-lg text-gray-600">
                                    이미 계정이 있으신가요?{' '}
                                    <Link href="/login" className="font-bold" style={{ color: '#4ECDC4' }}>
                                        로그인
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
                                src="/cute_typing_characters.png"
                                alt="Typing characters"
                                style={{ width: '100%', maxWidth: '450px', margin: '0 auto' }}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
