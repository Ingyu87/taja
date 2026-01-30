export interface PracticeResult {
    id: string;
    userId: string;
    username: string;
    avatar: string;
    mode: 'vowel' | 'consonant' | 'word' | 'sentence';
    cpm: number;
    accuracy: number;
    time: number;
    timestamp: number;
}

const STORAGE_KEY = 'taja_practice_results';
const USER_KEY = 'taja_current_user';

// 현재 사용자 정보
export interface User {
    id: string;
    username: string;
    avatar: string;
}

// 현재 사용자 가져오기
export const getCurrentUser = (): User | null => {
    if (typeof window === 'undefined') return null;
    const userStr = localStorage.getItem(USER_KEY);
    return userStr ? JSON.parse(userStr) : null;
};

// 현재 사용자 설정
export const setCurrentUser = (user: User): void => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(USER_KEY, JSON.stringify(user));
};

// 결과 저장
export const savePracticeResult = (result: Omit<PracticeResult, 'id' | 'timestamp'>): void => {
    if (typeof window === 'undefined') return;

    const results = getPracticeResults();
    const newResult: PracticeResult = {
        ...result,
        id: `${Date.now()}_${Math.random()}`,
        timestamp: Date.now(),
    };

    results.push(newResult);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(results));
};

// 모든 결과 가져오기
export const getPracticeResults = (): PracticeResult[] => {
    if (typeof window === 'undefined') return [];
    const resultsStr = localStorage.getItem(STORAGE_KEY);
    return resultsStr ? JSON.parse(resultsStr) : [];
};

// 사용자별 결과 가져오기
export const getUserResults = (userId: string): PracticeResult[] => {
    return getPracticeResults().filter(r => r.userId === userId);
};

// 모드별 랭킹 가져오기 (상위 10명)
export const getRankingByMode = (mode: string): PracticeResult[] => {
    const results = getPracticeResults().filter(r => r.mode === mode);

    // CPM 기준으로 정렬
    return results
        .sort((a, b) => b.cpm - a.cpm)
        .slice(0, 10);
};

// 전체 랭킹 가져오기
export const getOverallRanking = (): { userId: string; username: string; avatar: string; avgCpm: number; totalPractices: number }[] => {
    const results = getPracticeResults();
    const userStats = new Map<string, { username: string; avatar: string; totalCpm: number; count: number }>();

    results.forEach(result => {
        const existing = userStats.get(result.userId);
        if (existing) {
            existing.totalCpm += result.cpm;
            existing.count += 1;
        } else {
            userStats.set(result.userId, {
                username: result.username,
                avatar: result.avatar,
                totalCpm: result.cpm,
                count: 1,
            });
        }
    });

    return Array.from(userStats.entries())
        .map(([userId, stats]) => ({
            userId,
            username: stats.username,
            avatar: stats.avatar,
            avgCpm: Math.floor(stats.totalCpm / stats.count),
            totalPractices: stats.count,
        }))
        .sort((a, b) => b.avgCpm - a.avgCpm)
        .slice(0, 10);
};

// 사용자 통계 가져오기
export const getUserStats = (userId: string) => {
    const results = getUserResults(userId);

    if (results.length === 0) {
        return {
            totalPractices: 0,
            avgCpm: 0,
            avgAccuracy: 0,
            bestCpm: 0,
        };
    }

    const totalCpm = results.reduce((sum, r) => sum + r.cpm, 0);
    const totalAccuracy = results.reduce((sum, r) => sum + r.accuracy, 0);
    const bestCpm = Math.max(...results.map(r => r.cpm));

    return {
        totalPractices: results.length,
        avgCpm: Math.floor(totalCpm / results.length),
        avgAccuracy: Math.floor(totalAccuracy / results.length),
        bestCpm,
    };
};
