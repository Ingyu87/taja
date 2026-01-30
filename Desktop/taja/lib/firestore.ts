import { db } from './firebase';
import { collection, addDoc, query, orderBy, limit, getDocs, Timestamp, where } from 'firebase/firestore';

// 연습 결과 타입 정의
export interface PracticeResult {
    userId: string;
    username: string;
    avatar: string;
    mode: 'vowel' | 'consonant' | 'word' | 'sentence';
    cpm: number;
    accuracy: number;
    time: number;
    createdAt: Date;
}

// 컬렉션 이름
const RESULTS_COLLECTION = 'practice_results';

/**
 * 연습 결과를 Firestore에 저장합니다.
 */
export const saveResultToFirestore = async (result: Omit<PracticeResult, 'createdAt'>) => {
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
