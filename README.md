# 🎮 Vibe Flip Match - 교육용 메모리 카드 게임

<div align="center">
  
  ![React](https://img.shields.io/badge/React-18.3-61DAFB?logo=react&logoColor=white)
  ![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?logo=typescript&logoColor=white)
  ![Vite](https://img.shields.io/badge/Vite-5.4-646CFF?logo=vite&logoColor=white)
  ![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-3.4-06B6D4?logo=tailwindcss&logoColor=white)
  ![Supabase](https://img.shields.io/badge/Supabase-2.58-3ECF8E?logo=supabase&logoColor=white)
  
  **학습과 재미를 동시에! AI로 만든 교육용 메모리 매칭 게임** 🎯

</div>

## 📋 목차
- [소개](#-소개)
- [주요 기능](#-주요-기능)
- [기술 스택](#-기술-스택)
- [시작하기](#-시작하기)
- [게임 방법](#-게임-방법)
- [교육적 활용](#-교육적-활용)
- [기여하기](#-기여하기)

## ✨ 소개

**Vibe Flip Match**는 전통적인 메모리 카드 게임에 교육적 요소를 결합한 혁신적인 웹 게임입니다. 
Lovable AI 플랫폼을 활용하여 개발된 이 프로젝트는 학습과 엔터테인먼트를 완벽하게 융합했습니다.

### 🎯 프로젝트 목표
- 👨‍🏫 **교육자를 위한**: 수업에 활용 가능한 게이미피케이션 도구
- 👨‍👩‍👧‍👦 **가족을 위한**: 온 가족이 함께 즐기며 학습하는 게임
- 🧠 **학습자를 위한**: 재미있게 지식을 습득하는 플랫폼

## 🌟 주요 기능

### 🎮 게임 기능
- **3D 카드 플립 애니메이션** - 몰입감 있는 시각적 경험
- **다양한 난이도** - 쉬움(4쌍) → 전문가(10쌍)
- **힌트 시스템** - 어려울 때 도움받기 (최대 3회)
- **연속 매칭 보너스** - 실력에 따른 추가 점수
- **사운드 효과** - Web Audio API 기반 동적 사운드

### 📚 교육 카테고리
| 카테고리 | 아이콘 | 설명 | 학습 내용 |
|---------|--------|------|-----------|
| 이모지 | 😊 | 기본 매칭 게임 | 패턴 인식, 기억력 |
| 수학 | 🔢 | 수식과 답 매칭 | 사칙연산, 암산 |
| 영어 | 🔤 | 영단어-한글 매칭 | 어휘력, 번역 |
| 과학 | 🔬 | 화학식-물질명 매칭 | 원소기호, 화합물 |
| 역사 | 📚 | 인물-업적 매칭 | 한국사, 위인 |

### 🏆 경쟁 요소
- **실시간 리더보드** - 전체/카테고리별/난이도별 랭킹
- **점수 시스템** - 시간, 정확도, 난이도 반영
- **성과 추적** - 개인 최고 기록 저장

### 💡 특별 기능
- **PWA 지원 준비** - 오프라인 플레이 가능 (예정)
- **반응형 디자인** - 모든 디바이스 지원
- **접근성 고려** - 색약자 모드, 모션 감소 옵션
- **로컬 저장소** - 플레이어 이름 기억

## 🛠 기술 스택

### Frontend
```typescript
- React 18.3 + TypeScript 5.8
- Vite 5.4 (빌드 도구)
- Tailwind CSS 3.4 (스타일링)
- shadcn/ui (컴포넌트 라이브러리)
- Lucide React (아이콘)
- React Router DOM (라우팅)
```

### Backend
```sql
- Supabase (PostgreSQL)
- Row Level Security
- Real-time subscriptions
```

### 개발 도구
```bash
- Lovable AI (AI 기반 개발)
- ESLint + TypeScript ESLint
- PostCSS + Autoprefixer
```

## 🚀 시작하기

### 필수 요구사항
- Node.js 18+ & npm/yarn/bun
- Git

### 설치 방법

1. **저장소 클론**
```bash
git clone https://github.com/plusiam/vibe-flip-match.git
cd vibe-flip-match
```

2. **의존성 설치**
```bash
npm install
# 또는
yarn install
# 또는
bun install
```

3. **환경 변수 설정**
`.env` 파일을 생성하고 Supabase 키를 추가:
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. **개발 서버 실행**
```bash
npm run dev
# 또는
yarn dev
# 또는
bun dev
```

5. **브라우저에서 열기**
```
http://localhost:5173
```

### 프로덕션 빌드
```bash
npm run build
npm run preview
```

## 🎯 게임 방법

### 기본 규칙
1. **카테고리 선택** - 학습하고 싶은 주제 선택
2. **난이도 설정** - 실력에 맞는 난이도 선택
3. **카드 뒤집기** - 두 장씩 뒤집어 매칭
4. **점수 획득** - 빠르고 정확하게 매칭할수록 높은 점수

### 점수 계산
```typescript
점수 = (기본점수 × 난이도배수) + 시간보너스 - (시도횟수 × 5) + 연속보너스 - 힌트패널티
```

### 팁과 전략
- 🎯 **패턴 기억하기** - 카드 위치를 체계적으로 기억
- ⚡ **연속 매칭** - 연속 성공시 보너스 점수
- 💡 **힌트 활용** - 막힐 때 전략적으로 사용
- ⏰ **시간 관리** - 빠를수록 높은 점수

## 📚 교육적 활용

### 교실에서
- **워밍업 활동** - 수업 시작 전 5분 두뇌 활성화
- **복습 도구** - 배운 내용을 게임으로 복습
- **평가 도구** - 학습 진도 체크 및 평가

### 가정에서
- **가족 게임** - 온 가족이 함께하는 학습 시간
- **자기주도 학습** - 아이들의 자발적 학습 유도
- **실력 향상** - 난이도 조절로 점진적 성장

### 특별 활동
- **토너먼트** - 학급/학교 단위 대회 개최
- **팀 대전** - 협동 학습 및 팀워크 향상
- **주제별 학습** - 특정 단원 집중 학습

## 🔮 향후 계획

### 단기 목표 (v1.1)
- [ ] 더 많은 학습 카테고리 추가
- [ ] 멀티플레이어 실시간 대전
- [ ] 커스텀 카드 세트 생성 기능
- [ ] 학습 분석 대시보드

### 중기 목표 (v2.0)
- [ ] AI 기반 난이도 자동 조절
- [ ] 음성 인식 기능
- [ ] 다국어 지원 (영어, 일본어, 중국어)
- [ ] 교사용 관리 패널

### 장기 비전
- [ ] 모바일 앱 출시 (iOS/Android)
- [ ] AR 모드 지원
- [ ] 블록체인 기반 보상 시스템
- [ ] 교육 기관 연동 API

## 🤝 기여하기

프로젝트 개선에 참여해주세요!

### 기여 방법
1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### 기여 가능 영역
- 🐛 버그 수정
- ✨ 새 기능 제안
- 📚 문서 개선
- 🌍 번역 작업
- 🎨 디자인 개선

## 📄 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다.

## 🙏 감사의 말

- **Lovable AI** - AI 기반 개발 플랫폼 제공
- **shadcn/ui** - 아름다운 UI 컴포넌트
- **Supabase** - 강력한 백엔드 서비스
- **모든 기여자들** - 프로젝트 발전에 도움 주신 분들

## 📞 연락처

- **개발자**: 룰루랄라 한기쌤
- **이메일**: yeohanki@naver.com
- **GitHub**: [@plusiam](https://github.com/plusiam)
- **프로젝트 링크**: [https://github.com/plusiam/vibe-flip-match](https://github.com/plusiam/vibe-flip-match)

---

<div align="center">
  
  **Made with ❤️ by 룰루랄라 한기쌤**
  
  *교육과 기술의 만남, 더 나은 학습 경험을 위해*
  
</div>