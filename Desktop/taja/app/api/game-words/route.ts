import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

// API Key 확인
const API_KEY = process.env.GEMINI_API_KEY;

export async function POST(request: Request) {
    if (!API_KEY) {
        return NextResponse.json(
            { success: false, error: 'Gemini API Key가 설정되지 않았습니다.' },
            { status: 500 }
        );
    }

    try {
        const body = await request.json();
        const { count = 50, difficulty = 'easy' } = body;

        // Gemini API 초기화
        const genAI = new GoogleGenerativeAI(API_KEY);
        const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

        // 난이도별 프롬프트
        let difficultyDesc = '';
        if (difficulty === 'easy') {
            difficultyDesc = '2-3글자의 매우 쉬운 단어 (예: 가방, 나무, 사과, 하늘, 강아지)';
        } else if (difficulty === 'medium') {
            difficultyDesc = '3-4글자의 보통 난이도 단어 (예: 자동차, 컴퓨터, 연필통, 칠판)';
        } else {
            difficultyDesc = '4-6글자의 어려운 단어 (예: 도서관, 운동장, 지우개, 필통)';
        }

        // 프롬프트 구성
        const prompt = `
        초등학생 타자 연습용 교육적인 한글 단어 ${count}개를 생성해주세요.
        
        난이도: ${difficultyDesc}
        
        조건:
        1. 각 단어는 쉼표로 구분하여 한 줄로 나열해주세요.
        2. 초등학생이 알만한 일상적이고 친근한 단어만 사용하세요.
        3. 긍정적이고 교육적인 단어만 포함하세요.
        4. 다양한 주제의 단어를 섞어주세요 (동물, 식물, 사물, 장소, 감정 등).
        5. 중복되는 단어가 없도록 해주세요.
        
        🚨 절대 금지사항:
        - 욕설, 비속어, 폭언은 절대 포함하지 마세요.
        - 폭력적이거나 무서운 단어는 제외하세요.
        - 차별적이거나 부적절한 단어는 사용하지 마세요.
        - 부정적이거나 슬픈 단어는 최소화하세요.
        
        출력 형식 (예시):
        가방, 나무, 사과, 하늘, 강아지, 꽃, 책, 연필, 공책, 친구
        
        위 형식으로 정확히 ${count}개의 단어만 출력해주세요.
        `;

        // 단어 생성
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        // 쉼표로 단어 분리 및 정리
        const words = text
            .split(',')
            .map(word => word.trim())
            .filter(word => word.length > 0 && word.length <= 10) // 너무 긴 단어 제외
            .slice(0, count); // 요청한 개수만큼만

        if (words.length === 0) {
            throw new Error('단어 생성 실패');
        }

        return NextResponse.json({ success: true, words });

    } catch (error: any) {
        console.error('Gemini API Error:', error);
        return NextResponse.json(
            { success: false, error: '단어 생성 중 오류가 발생했습니다. (' + (error.message || 'Unknown') + ')' },
            { status: 500 }
        );
    }
}
