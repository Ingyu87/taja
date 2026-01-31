// 사용자 타입 정의
export type UserRole = 'student' | 'teacher';

// 실제 앱에서 사용하는 사용자 타입
export interface User {
    id: string;
    username: string;
    avatar: string;
    role: UserRole;
}

// 향후 확장용 사용자 타입 (현재 미사용)
export interface ExtendedUser {
    uid: string;
    role: UserRole;
    displayName: string;
    email: string;
    avatar: string; // 아바타 이미지 경로
    grade?: number; // 학년 (1-6)
    classId?: string; // 반 ID
    level: number; // 전체 레벨 (1-100)
    exp: number; // 경험치
    badges: string[]; // 획득 배지 ID 배열
    titles: string[]; // 획득 칭호 배열
    activeTitle?: string; // 현재 사용 중인 칭호
    createdAt: Date;
    lastLoginAt: Date;
}

// 타자 연습 카테고리
export type PracticeCategory =
    | 'vowel'
    | 'consonant'
    | 'word'
    | 'sentence'
    | 'paragraph'
    | 'ai-story';

// 게임 타입
export type GameType =
    | 'falling'
    | 'bomb'
    | 'timeattack';

// 난이도
export type Difficulty = 1 | 2 | 3;

// 타자 기록
export interface TypingRecord {
    recordId: string;
    userId: string;
    type: 'practice' | 'game';
    category: PracticeCategory | GameType;
    textId?: string; // 연습한 텍스트 ID
    duration: number; // 초
    cpm: number; // 분당 타자 수 (Characters Per Minute)
    accuracy: number; // 정확도 (%)
    totalChars: number;
    wrongChars: number;
    weakKeys: string[]; // 자주 틀린 키
    createdAt: Date;
}

// AI 스토리
export type StoryGenre =
    | 'fairy-tale'
    | 'poem'
    | 'description'
    | 'letter'
    | 'dialogue';

export interface AIStory {
    storyId: string;
    userId: string; // 생성자
    genre: StoryGenre;
    topic: string; // 사용자가 입력한 주제
    content: string; // 생성된 글
    length: number; // 글자 수
    approved: boolean; // 관리자 승인 여부
    savedBy: string[]; // 저장한 사용자 ID 배열
    usageCount: number; // 사용 횟수
    createdAt: Date;
}

// 연습 콘텐츠
export interface PracticeContent {
    contentId: string;
    category: PracticeCategory;
    subCategory?: string; // 'animal', 'fruit', 'school' 등
    text: string;
    difficulty: Difficulty;
    imageUrl?: string;
    approved: boolean;
    createdAt: Date;
}

// 반 정보
export interface Class {
    classId: string;
    name: string; // "3학년 2반"
    teacherId: string;
    studentIds: string[];
    inviteCode: string;
    createdAt: Date;
}

// 배지
export interface Badge {
    badgeId: string;
    name: string;
    description: string;
    iconUrl: string;
    condition: {
        type: 'speed' | 'accuracy' | 'practice-count' | 'game-clear' | 'level' | 'streak';
        value: number;
        category?: string;
    };
}

// 성취 기록
export interface Achievement {
    achievementId: string;
    userId: string;
    badgeId: string;
    unlockedAt: Date;
}

// 리더보드 항목
export interface LeaderboardEntry {
    userId: string;
    displayName: string;
    avatar: string;
    score: number;
    rank: number;
}

// 리더보드
export interface Leaderboard {
    leaderboardId: string;
    period: 'daily' | 'weekly' | 'monthly';
    category: 'speed' | 'accuracy' | GameType;
    rankings: LeaderboardEntry[];
    updatedAt: Date;
}

// 게임 결과
export interface GameResult {
    userId: string;
    username: string;
    avatar: string;
    gameType: GameType;
    score: number;
    level: number;
    accuracy: number;
    createdAt: Date;
}
