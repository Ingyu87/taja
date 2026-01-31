import { db } from './firebase';
import { collection, addDoc, query, orderBy, limit, getDocs, Timestamp, where } from 'firebase/firestore';
import { GameResult } from '@/types';

// 연습 결과 타입 정의
export interface PracticeResult {
    userId: string;
    username: string;
    avatar: string;
    mode: 'vowel' | 'consonant' | 'word' | 'sentence' | 'story';
    cpm: number;
    accuracy: number;
    time: number;
    keywords?: string; // AI 스토리의 경우 키워드 저장
    createdAt: Date;
}

// 컬렉션 이름
const RESULTS_COLLECTION = 'practice_results';
const GAME_RESULTS_COLLECTION = 'game_results';

/**
 * 연습 결과를 Firestore에 저장합니다.
 */
export const saveResultToFirestore = async (result: Omit<PracticeResult, 'createdAt'>) => {
    if (!db) {
        console.warn("Firestore is not initialized. Skipping save.");
        return { success: true, id: 'offline' }; // 에러 없이 통과시킴
    }
    try {
        const docRef = await addDoc(collection(db, RESULTS_COLLECTION), {
            ...result,
            createdAt: Timestamp.now(),
        });
        console.log("Document written with ID: ", docRef.id);
        return { success: true, id: docRef.id };
    } catch (e) {
        console.error("Error adding document: ", e);
        return { success: false, error: e };
    }
};

/**
 * 전체 랭킹을 가져옵니다. (타자 속도 내림차순, 상위 100개)
 */
export const getRankingsFromFirestore = async (limitCount = 100) => {
    if (!db) {
        console.warn("Firestore is not initialized. Returning empty rankings.");
        return [];
    }
    try {
        const q = query(
            collection(db, RESULTS_COLLECTION),
            orderBy('cpm', 'desc'),
            limit(limitCount)
        );

        const querySnapshot = await getDocs(q);
        const rankings: PracticeResult[] = [];

        querySnapshot.forEach((doc) => {
            const data = doc.data();
            rankings.push({
                userId: data.userId,
                username: data.username,
                avatar: data.avatar,
                mode: data.mode,
                cpm: data.cpm,
                accuracy: data.accuracy,
                time: data.time,
                createdAt: data.createdAt.toDate(),
            });
        });

        return rankings;
    } catch (e) {
        console.error("Error getting documents: ", e);
        return [];
    }
};

/**
 * 특정 모드의 랭킹을 가져옵니다.
 */
export const getModeRankingsFromFirestore = async (mode: string, limitCount = 50) => {
    if (!db) {
        console.warn("Firestore is not initialized. Returning empty rankings.");
        return [];
    }
    try {
        const q = query(
            collection(db, RESULTS_COLLECTION),
            where('mode', '==', mode),
            orderBy('cpm', 'desc'),
            limit(limitCount)
        );

        const querySnapshot = await getDocs(q);
        const rankings: PracticeResult[] = [];

        querySnapshot.forEach((doc) => {
            const data = doc.data();
            rankings.push({
                userId: data.userId,
                username: data.username,
                avatar: data.avatar,
                mode: data.mode,
                cpm: data.cpm,
                accuracy: data.accuracy,
                time: data.time,
                createdAt: data.createdAt.toDate(),
            });
        });

        return rankings;
    } catch (e) {
        console.error("Error getting documents: ", e);
        return [];
    }
};

/**
 * 모든 연습 결과를 가져옵니다. (교사용, 최신순 1000개)
 */
export const getAllResultsFromFirestore = async (limitCount = 1000) => {
    if (!db) {
        console.warn("Firestore is not initialized. Returning empty results.");
        return [];
    }
    try {
        const q = query(
            collection(db, RESULTS_COLLECTION),
            orderBy('createdAt', 'desc'),
            limit(limitCount)
        );

        const querySnapshot = await getDocs(q);
        const results: PracticeResult[] = [];

        querySnapshot.forEach((doc) => {
            const data = doc.data();
            results.push({
                userId: data.userId,
                username: data.username,
                avatar: data.avatar,
                mode: data.mode,
                cpm: data.cpm,
                accuracy: data.accuracy,
                time: data.time,
                createdAt: data.createdAt.toDate(),
            });
        });

        return results;
    } catch (e) {
        console.error("Error getting all documents: ", e);
        return [];
    }
};

/**
 * 게임 결과를 Firestore에 저장합니다.
 */
export const saveGameResultToFirestore = async (result: Omit<GameResult, 'createdAt'>) => {
    if (!db) {
        console.warn("Firestore is not initialized. Skipping save.");
        return { success: true, id: 'offline' };
    }
    try {
        const docRef = await addDoc(collection(db, GAME_RESULTS_COLLECTION), {
            ...result,
            createdAt: Timestamp.now(),
        });
        console.log("Game result written with ID: ", docRef.id);
        return { success: true, id: docRef.id };
    } catch (e) {
        console.error("Error adding game result: ", e);
        return { success: false, error: e };
    }
};

/**
 * 게임별 랭킹을 가져옵니다.
 */
export const getGameRankingsFromFirestore = async (gameType?: string, limitCount = 100) => {
    if (!db) {
        console.warn("Firestore is not initialized. Returning empty rankings.");
        return [];
    }
    try {
        let q;
        if (gameType) {
            q = query(
                collection(db, GAME_RESULTS_COLLECTION),
                where('gameType', '==', gameType),
                orderBy('score', 'desc'),
                limit(limitCount)
            );
        } else {
            q = query(
                collection(db, GAME_RESULTS_COLLECTION),
                orderBy('score', 'desc'),
                limit(limitCount)
            );
        }

        const querySnapshot = await getDocs(q);
        const rankings: GameResult[] = [];

        querySnapshot.forEach((doc) => {
            const data = doc.data();
            rankings.push({
                userId: data.userId,
                username: data.username,
                avatar: data.avatar,
                gameType: data.gameType,
                score: data.score,
                level: data.level,
                accuracy: data.accuracy,
                createdAt: data.createdAt.toDate(),
            });
        });

        return rankings;
    } catch (e) {
        console.error("Error getting game rankings: ", e);
        return [];
    }
};
