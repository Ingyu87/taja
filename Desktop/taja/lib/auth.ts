// 간단한 인증 로직
export interface User {
    id: string;
    username: string;
    avatar: string;
    role: 'student' | 'teacher';
}

const STUDENT_PASSWORD = '1234';
const TEACHER_PASSWORD = '2026';

// 학생 계정: a1 ~ a30
const STUDENT_IDS = Array.from({ length: 30 }, (_, i) => `a${i + 1}`);

// 아바타 목록
const AVATARS = [
    { id: 'bear', emoji: '🐻' },
    { id: 'cat', emoji: '🐱' },
    { id: 'dog', emoji: '🐶' },
    { id: 'rabbit', emoji: '🐰' },
    { id: 'fox', emoji: '🦊' },
    { id: 'panda', emoji: '🐼' },
];

/**
 * 로그인 검증
 */
export const validateLogin = (username: string, password: string): { success: boolean; user?: User; error?: string } => {
    // 교사 로그인 (비밀번호가 2026이면 교사)
    if (password === TEACHER_PASSWORD) {
        return {
            success: true,
            user: {
                id: `teacher_${username}`,
                username: username || '교사',
                avatar: '👨‍🏫',
                role: 'teacher',
            },
        };
    }

    // 학생 로그인 (a1~a30, 비밀번호 1234)
    if (password === STUDENT_PASSWORD) {
        if (STUDENT_IDS.includes(username)) {
            // 로컬 스토리지에서 아바타 가져오기 (없으면 랜덤)
            const savedAvatar = getStudentAvatar(username);
            return {
                success: true,
                user: {
                    id: username,
                    username,
                    avatar: savedAvatar,
                    role: 'student',
                },
            };
        } else {
            return {
                success: false,
                error: '학생 계정은 a1부터 a30까지만 사용 가능합니다.',
            };
        }
    }

    return {
        success: false,
        error: '아이디 또는 비밀번호가 올바르지 않습니다.',
    };
};

/**
 * 회원가입 (학생만 가능, 아바타 선택)
 */
export const registerStudent = (username: string, password: string, avatarId: string): { success: boolean; error?: string } => {
    // 비밀번호 확인
    if (password !== STUDENT_PASSWORD) {
        return {
            success: false,
            error: '학생 비밀번호는 1234입니다.',
        };
    }

    // 학생 ID 확인
    if (!STUDENT_IDS.includes(username)) {
        return {
            success: false,
            error: '학생 계정은 a1부터 a30까지만 사용 가능합니다.',
        };
    }

    // 아바타 저장
    const avatar = AVATARS.find(a => a.id === avatarId);
    if (avatar) {
        saveStudentAvatar(username, avatar.emoji);
    }

    return { success: true };
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
