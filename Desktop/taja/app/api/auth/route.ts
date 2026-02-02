import { NextResponse } from 'next/server';

const STUDENT_PASSWORD = (process.env.STUDENT_PASSWORD || '1234').trim();
const TEACHER_PASSWORD = (process.env.TEACHER_PASSWORD || '2026').trim();

// 학생 계정 유효성 검사 (a1 ~ a130)
const isValidStudentId = (username: string) => {
    const match = username.match(/^a(\d+)$/);
    if (!match) return false;
    const num = parseInt(match[1], 10);
    return num >= 1 && num <= 130;
};

export async function POST(request: Request) {
    try {
        const body = await request.json();
        let { type, username, password, role } = body;

        // 공백 제거 및 소문자 변환 (ID의 경우)
        if (username) username = username.toString().trim().toLowerCase();
        if (password) password = password.toString().trim();

        // 로그인 처리
        if (type === 'login') {
            // 교사 로그인 (role이 teacher이거나 username이 teacher인 경우)
            if (role === 'teacher' || username === 'teacher') {
                if (password === TEACHER_PASSWORD) {
                    return NextResponse.json({
                        success: true,
                        user: {
                            id: `teacher_${username || 'admin'}`,
                            username: username || '교사',
                            avatar: '👨‍🏫',
                            role: 'teacher',
                        },
                    });
                }
                return NextResponse.json({ success: false, error: '교사 관리자 비밀번호가 올바르지 않습니다.' }, { status: 401 });
            }

            // 학생 로그인
            if (password === STUDENT_PASSWORD) {
                if (isValidStudentId(username)) {
                    return NextResponse.json({
                        success: true,
                        user: {
                            id: username,
                            username,
                            avatar: '🐻', // 클라이언트에서 로컬 스토리지값으로 덮어씌움
                            role: 'student',
                        },
                    });
                } else {
                    return NextResponse.json({ success: false, error: '학생 계정은 a1부터 a130까지만 사용 가능합니다.' }, { status: 400 });
                }
            }

            return NextResponse.json({ success: false, error: '비밀번호가 올바르지 않습니다.' }, { status: 401 });
        }

        // 회원가입 처리 (학생 확인)
        if (type === 'register') {
            if (password !== STUDENT_PASSWORD) {
                return NextResponse.json({ success: false, error: '학생 비밀번호가 올바르지 않습니다.' }, { status: 401 });
            }

            if (!isValidStudentId(username)) {
                return NextResponse.json({ success: false, error: '학생 계정은 a1부터 a130까지만 사용 가능합니다.' }, { status: 400 });
            }

            return NextResponse.json({ success: true });
        }

        return NextResponse.json({ success: false, error: 'Invalid request type' }, { status: 400 });

    } catch (error) {
        return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
    }
}
