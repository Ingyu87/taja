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
        const { keywords } = body;

        if (!keywords || !Array.isArray(keywords) || keywords.length === 0) {
            return NextResponse.json(
                { success: false, error: '단어 목록이 제공되지 않았습니다.' },
                { status: 400 }
            );
        }

        // Gemini API 초기화
        const genAI = new GoogleGenerativeAI(API_KEY);
        const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

        // 프롬프트 구성
        const prompt = `
        다음 단어들을 모두 포함하여 초등학생이 읽기 좋은 재미있고 교훈적인 짧은 동화를 만들어주세요.
        
        단어 목록: ${keywords.join(', ')}
        
        조건:
        1. 300자 내외로 짧게 작성해주세요.
        2. 이모지를 적절히 사용하여 생동감 있게 만들어주세요.
        3. 아이들이 이해하기 쉬운 쉬운 단어를 사용해주세요.
        4. 제목을 가장 첫 줄에 적어주세요.
        5. 존댓말(해요체)을 사용해주세요.
        `;

        // 스토리 생성
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        return NextResponse.json({ success: true, story: text });

    } catch (error: any) {
        console.error('Gemini API Error:', error);
        return NextResponse.json(
            { success: false, error: '스토리 생성 중 오류가 발생했습니다. (' + (error.message || 'Unknown') + ')' },
            { status: 500 }
        );
    }
}
