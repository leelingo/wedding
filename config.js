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
    motherDeceased: false,
    tel: "010-0000-0000"   // 연락하기 팝업에 노출되는 번호
  },

  bride: {
    name: "이정은",
    nameEn: "Jungeun",
    father: "이재식",
    mother: "남명자",
    fatherDeceased: false,
    motherDeceased: false,
    tel: "010-0000-0000"
  },

  wedding: {
    date: "2026-12-12",
    time: "11:00",
    venue: "노블발렌티 대치",
    hall: "단독홀",
    address: "서울시 강남구 영동대로 325 S TOWER",
    tel: "02-000-0000",
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
        { color: "#4a7c3f", text: "지선버스 : 4319" }
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
    content: "서로의 삶에 따뜻한 동반자가 되어 \n사랑과 신뢰로 한 가정을 이루려 합니다.\n축복의 자리에 귀한 걸음 하시어 \n저희의 새로운 시작을 함께해 주시면 감사하겠습니다."
  },

  // ── 인터뷰 ──
  // 각 항목의 answerGroom/answerBride 중 필요한 것만 채워도 됩니다.
  interview: {
    title: "우리 두 사람의 이야기",
    subtitle: "결혼을 앞두고 저희 두 사람의\n인터뷰를 준비했습니다.",
    questions: [
      { q: "처음 만났을 때 첫인상이 어땠나요?", answerGroom: "이 자리를 빌려 적어주세요.", answerBride: "이 자리를 빌려 적어주세요." },
      { q: "결혼을 결심하게 된 계기는 무엇인가요?", answerGroom: "이 자리를 빌려 적어주세요.", answerBride: "이 자리를 빌려 적어주세요." },
      { q: "앞으로 어떤 부부가 되고 싶나요?", answerGroom: "이 자리를 빌려 적어주세요.", answerBride: "이 자리를 빌려 적어주세요." }
    ]
  },

  // ── 프로필 ──
  profile: {
    title: "두 사람을 소개합니다",
    groom: {
      birth: "1993년 9월 25일",
      region: "서울 동작구",
      tags: "#ENTJ #회사원",
      tagline: "든든한 남편이 되겠습니다"
    },
    bride: {
      birth: "1996년 3월 14일",
      region: "용인 수지구",
      tags: "#ISFP #은행원",
      tagline: "따뜻한 아내가 되겠습니다"
    }
  },

  // ── 예식정보 및 안내사항 (가로 스크롤 카드) ──
  info: {
    title: "예식정보 및 안내사항",
    cards: [
      { image: "images/story/1.jpg", title: "포토부스 이용안내", content: "포토부스가 설치될 예정입니다.\n귀한 발걸음 해주신 여러분의\n환한 미소와 따뜻한 말씀 남겨주시면\n소중히 간직하도록 하겠습니다." },
      { image: "images/story/2.jpg", title: "주차 안내", content: "건물 내 주차장을 이용하실 수 있습니다.\n주차 등록은 예식장 안내데스크에서\n도와드리겠습니다." }
    ]
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
      { role: "어머니", name: "남명자", bank: "농협은행", number: "000-000-000000" }
    ]
  },

  // ── 링크 공유 시 나타나는 문구 ──
  meta: {
    title: "서상우 ♥ 이정은 결혼합니다",
    description: "2026년 12월 12일, 소중한 분들을 초대합니다."
  }
};
