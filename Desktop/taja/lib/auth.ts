// 간단한 인증 로직 (서버 API 호출)
import { User } from '@/types';

// User 타입 re-export (다른 파일에서 사용하기 위해)
export type { User };

// 아바타 목록
export const AVATARS = [
    { id: 'bear', emoji: '🐻', name: '곰돌이' },
    { id: 'cat', emoji: '🐱', name: '고양이' },
    { id: 'dog', emoji: '🐶', name: '강아지' },
    { id: 'rabbit', emoji: '🐰', name: '토끼' },
    { id: 'fox', emoji: '🦊', name: '여우' },
    { id: 'panda', emoji: '🐼', name: '판다' },
];

/**
 * 로그인 검증 (서버 API 호출)
 */
export const validateLogin = async (username: string, password: string, role: 'student' | 'teacher'): Promise<{ success: boolean; user?: User; error?: string }> => {
    try {
        const res = await fetch('/api/auth', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ type: 'login', username, password, role }),
        });

        const data = await res.json();

        if (data.success && data.user) {
            // 학생일 경우 로컬 스토리지에 저장된 아바타 불러오기
            if (data.user.role === 'student') {
                const savedAvatar = getStudentAvatar(data.user.username);
                data.user.avatar = savedAvatar;
            }
            return { success: true, user: data.user };
        } else {
            return { success: false, error: data.error || '로그인에 실패했습니다.' };
        }
    } catch (error) {
        return { success: false, error: '서버 통신 중 오류가 발생했습니다.' };
    }
};

/**
 * 회원가입 (서버 API 호출 및 로컬에 아바타 저장)
 */
export const registerStudent = async (username: string, password: string, avatarId: string): Promise<{ success: boolean; error?: string }> => {
    try {
        // 1. 서버에 비밀번호 및 ID 검증 요청
        const res = await fetch('/api/auth', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ type: 'register', username, password }),
        });

        const data = await res.json();

        if (!data.success) {
            return { success: false, error: data.error };
        }

        // 2. 검증 성공 시 로컬에 아바타 저장
        const avatar = AVATARS.find(a => a.id === avatarId);
        if (avatar) {
            saveStudentAvatar(username, avatar.emoji);
        }

        return { success: true };

    } catch (error) {
        return { success: false, error: '서버 통신 중 오류가 발생했습니다.' };
    }
};

/**
 * 학생 아바타 저장
 */
const saveStudentAvatar = (username: string, avatar: string): void => {
    if (typeof window === 'undefined') return;
    const key = `student_avatar_${username}`;
    localStorage.setItem(key, avatar);
};

/**
 * 학생 아바타 가져오기
 */
const getStudentAvatar = (username: string): string => {
    if (typeof window === 'undefined') return '🐻';
    const key = `student_avatar_${username}`;
    const saved = localStorage.getItem(key);
    if (saved) return saved;

    // 없으면 랜덤 아바타 할당 후 저장
    const randomAvatar = AVATARS[Math.floor(Math.random() * AVATARS.length)].emoji;
    saveStudentAvatar(username, randomAvatar);
    return randomAvatar;
};

/**
 * 현재 로그인한 사용자 저장
 */
export const saveCurrentUser = (user: User): void => {
    if (typeof window === 'undefined') return;
    localStorage.setItem('current_user', JSON.stringify(user));
};

/**
 * 현재 로그인한 사용자 가져오기
 */
export const getCurrentUser = (): User | null => {
    if (typeof window === 'undefined') return null;
    const userStr = localStorage.getItem('current_user');
    return userStr ? JSON.parse(userStr) : null;
};

/**
 * 로그아웃
 */
export const logout = (): void => {
    if (typeof window === 'undefined') return;
    localStorage.removeItem('current_user');
};
