/**
 * Wedding Invitation Configuration (v2)
 *
 * 이 파일에서 청첩장의 모든 정보를 수정할 수 있습니다.
 * 이미지는 설정이 필요 없습니다. 아래 폴더에 순번 파일명으로 넣으면 자동 감지됩니다.
 *
 * 이미지 폴더 구조 (파일명 규칙):
 *   images/hero/1.jpg       - 메인(히어로) 사진 (1장, 필수, 세로 사진 권장)
 *   images/story/1.jpg, 2.jpg, ...   - 클로징 섹션에 쓰이는 사진 (순번, 자동 감지)
 *   images/gallery/1.jpg, 2.jpg, ... - 갤러리 사진들 (순번, 자동 감지)
 *   images/profile/1.jpg    - 신랑 프로필 사진
 *   images/profile/2.jpg    - 신부 프로필 사진
 *   images/location/1.jpg   - 약도/지도 이미지 (1장)
 *   images/og/1.jpg         - 카카오톡 등 공유 시 나타나는 썸네일 (1장)
 */

const CONFIG = {
  // ── 메인 (히어로) ──
  hero: {
    dateDay: "24TH",   // 히어로 하단 날짜 표기 (일)
    dateMonth: "OCT"   // 히어로 하단 날짜 표기 (월, 영문 약자)
  },

  groom: {
    name: "서상우",
    nameEn: "Sangwoo",
    father: "서귀원",
    mother: "양금례",
    fatherDeceased: false,
    motherDeceased: false
  },

  bride: {
    name: "이정은",
    nameEn: "Jungeun",
    father: "이재식",
    mother: "남규리(명자)",
    fatherDeceased: false,
    motherDeceased: false
  },

  wedding: {
    date: "2026-12-12",
    time: "11:00",
    venue: "노블발렌티 대치",
    address: "서울시 강남구 영동대로 325 S TOWER",
    mapLinks: {
      naver: "https://naver.me/G58gjjWp",
    },
    // 오시는 길 - 대중교통 안내
    transit: {
      subway: [
        { color: "#00A23F", text: "2호선 삼성역 3번 출구" },
        { color: "#d4a03c", text: "분당선 강남구청역 3-1번 출구" }
      ],
      bus: [
        { color: "#1e3a6e", text: "간선버스 : 343, 401" },
        { color: "#4a7c3f", text: "지선버스 : 4319" },
        { color: "#F8B62B", text: "마을버스 : 강남01, 강남06"}
      ],
      shuttleNote: "셔틀버스 수시 운행\n 2호선 삼성역 3번 출구 30M 전방"
    }
  },

  // ── 인사말 ──
  greeting: {
    quote: "저절로 웃음이 났다.\n웃는 남자를 보고 여자도 웃었다.\n마음에 꽃이 피는 것 같았다.\n정말로 봄이었다.",
    quoteSource: "정현주 < 다시, 사랑 > 중에서",
    title: "소중한 분들을 초대합니다",
    content: "서로의 삶에 따뜻한 동반자가 되어 \n사랑과 신뢰로 한 가정을 이루려 합니다.\n축복의 자리에 귀한 걸음 하시어 \n저희의 새로운 시작을 \n함께해 주시면 감사하겠습니다."
  },

  // ── 인터뷰 섹션 (제목 · 부제 · 사진 두 장) ──
  interview: {
    title: "함께 맞는 일곱번째 겨울",
    subtitle: "긴 시간 함께 걸어온 저희 두 사람이\n이제 같은 곳을 바라보려 합니다."
  },


  // ── 클로징 ──
  closing: {
    label: "Be our witness\nas we start forever.",
    message: "참 잘했습니다."
  },

  // ── 마음 전하실 곳 ──
  accounts: {
    groom: [
      { role: "신랑", name: "서상우", bank: "신한은행", number: "110-000-000000" },
      { role: "아버지", name: "서귀원", bank: "국민은행", number: "000-000-000000" },
      { role: "어머니", name: "양금례", bank: "우리은행", number: "000-000-000000" }
    ],
    bride: [
      { role: "신부", name: "이정은", bank: "하나은행", number: "000-000-000000" },
      { role: "아버지", name: "이재식", bank: "기업은행", number: "000-000-000000" },
      { role: "어머니", name: "남규리(명자)", bank: "농협은행", number: "000-000-000000" }
    ]
  },

  // ── 링크 공유 시 나타나는 문구 ──
  meta: {
    title: "서상우 ♥ 이정은 결혼합니다",
    description: "2026년 12월 12일, 소중한 분들을 초대합니다."
  }
};
