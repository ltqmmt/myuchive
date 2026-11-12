export type MusicalNumber = {
  id: string
  order: number
  title: string
  scene: string
  /** 넘버 순서와 장면 설명만으로 만든 모의 후기. 북마크한 후기가 없을 때 단서로 보여준다. */
  aiReview: string
}

export type AudienceReview = {
  id: string
  numberId: string
  author: string
  watchedOn: string
  body: string
}

export type Show = {
  id: string
  title: string
  venue: string
  /** 오늘 공연 시간 */
  todayLabel: string
  cast?: string
  numbers: MusicalNumber[]
  reviews: AudienceReview[]
}

/** 넘버와 묶이지 않은 공연 전체 감상 */
export const WHOLE_SHOW = "all"

export type RecordEntry = {
  /** 넘버 id 또는 WHOLE_SHOW */
  numberId: string
  text: string
  /** 작성할 때 보였던 단서. own은 직접 작성하기로 추가한 감상 */
  clue: "bookmark" | "ai" | "own"
}

export type ShowRecord = {
  id: string
  showId: string
  date: string
  cast?: string
  entries: RecordEntry[]
  durationSec: number
}

export const TODAY = "2026-11-12"

/* 모든 공연 데이터(넘버 구성, 장면 설명, 관객 후기, AI 모의 후기)는 화면 확인용 예시입니다. */

const winterGarden: Show = {
  id: "winter-garden",
  title: "겨울 정원",
  venue: "달빛아트홀",
  todayLabel: "11월 12일 (목) 19:30",
  cast: "해온 이서진 · 도윤 박건우",
  numbers: [
    {
      id: "wg-1",
      order: 1,
      title: "서곡 – 첫눈",
      scene: "막이 오르면 텅 빈 온실에 눈이 내리고, 정원사 해온이 얼어붙은 화분을 하나씩 닦는다.",
      aiReview:
        "막이 오르자마자 온실 유리 너머로 눈이 내렸다. 해온이 화분을 하나씩 닦는 손이 유난히 느려서, 대사 없이도 이곳에 오래 혼자 있었다는 게 느껴졌다.",
    },
    {
      id: "wg-2",
      order: 2,
      title: "아무도 오지 않는 정원",
      scene: "해온이 객석 쪽 창문을 열고 \"올해도 봄은 늦겠지\"라고 혼잣말한 뒤 첫 솔로를 부른다.",
      aiReview:
        "\"올해도 봄은 늦겠지\"라는 혼잣말 뒤에 시작된 첫 솔로. 창문을 객석 쪽으로 열어서, 마치 관객에게 말을 거는 것처럼 들렸다.",
    },
    {
      id: "wg-3",
      order: 3,
      title: "편지",
      scene: "해온이 형 도윤이 남긴 편지를 발견한다. 편지를 읽는 동안 조명이 반으로 나뉘고, 반대편에서 도윤이 같은 문장을 노래한다.",
      aiReview:
        "편지를 읽는 해온과 반대편에서 같은 문장을 부르는 도윤. 조명이 무대를 반으로 가르는 순간, 두 사람이 같은 시간에 있지 않다는 걸 알게 됐다.",
    },
    {
      id: "wg-4",
      order: 4,
      title: "두 개의 계절",
      scene: "형제가 무대 양끝에서 서로를 보지 못한 채 화음을 쌓고, 마지막 소절에서 처음으로 눈을 맞춘다.",
      aiReview:
        "무대 양끝에서 서로를 보지 못한 채 쌓이던 화음. 마지막 소절에서 처음 눈이 마주쳤을 때 객석 전체가 숨을 멈춘 것 같았다.",
    },
    {
      id: "wg-5",
      order: 5,
      title: "겨울이 끝나는 법",
      scene: "해온이 온실 천장의 유리를 깨고, 쏟아지는 눈 속에서 클라이맥스를 부른다.",
      aiReview:
        "천장 유리가 깨지고 눈이 한꺼번에 쏟아지던 클라이맥스. 해온이 위를 올려다보며 고음을 버티는 동안 무대가 하얗게 덮였다.",
    },
    {
      id: "wg-6",
      order: 6,
      title: "커튼콜 – 봄의 첫 잎",
      scene: "모든 조명이 꺼지고, 무대 중앙 화분의 작은 새싹 하나만 빛을 받는다.",
      aiReview:
        "모든 조명이 꺼지고 화분 속 새싹 하나만 남았다. 박수가 나오기까지 몇 초의 정적이 있었는데, 그 정적까지 공연의 일부처럼 느껴졌다.",
    },
  ],
  reviews: [
    { id: "wg-r1", numberId: "wg-1", author: "겨울관객", watchedOn: "11.08", body: "화분 닦을 때 입김이 보이도록 조명을 낮춘 게 좋았다. 오른쪽 세 번째 화분만 끝까지 안 닦는데, 그게 형의 화분이라는 걸 나중에 알았다." },
    { id: "wg-r2", numberId: "wg-1", author: "온실지기", watchedOn: "11.05", body: "서곡 첫 음이 첼로 솔로로 시작해서 눈 떨어지는 속도랑 박자가 맞는다. 처음 보는 분들은 눈 내리는 타이밍을 꼭 보세요." },
    { id: "wg-r3", numberId: "wg-2", author: "2층C열", watchedOn: "11.09", body: "\"올해도 봄은 늦겠지\" 하고 창문 닫으려다 멈추는 손. 오늘 이서진 배우는 창틀에 이마를 잠깐 대고 있다가 노래를 시작했다." },
    { id: "wg-r4", numberId: "wg-2", author: "봄을기다림", watchedOn: "11.06", body: "솔로 2절에서 '아무도'를 반 박자 늦게 부르는데 회차마다 길이가 다르다. 오늘은 거의 한 마디를 쉬었다." },
    { id: "wg-r5", numberId: "wg-3", author: "편지는두번", watchedOn: "11.09", body: "편지 마지막 줄 '창문은 열어둬'를 해온은 읽기만 하고 도윤만 노래한다. 그다음 해온이 2막 내내 창문을 열어두는 게 이 장면 때문." },
    { id: "wg-r6", numberId: "wg-3", author: "겨울관객", watchedOn: "11.08", body: "조명이 갈라질 때 무대 바닥에 선이 그어지는데, 도윤이 그 선을 한 번 밟으려다 물러난다. 놓치기 쉬운 동작." },
    { id: "wg-r7", numberId: "wg-4", author: "온실지기", watchedOn: "11.05", body: "눈 맞추는 마지막 소절에서 둘 다 숨을 같이 쉰다. 마이크로 들릴 만큼 크게. 오늘은 박건우 배우가 먼저 웃었다." },
    { id: "wg-r8", numberId: "wg-4", author: "2층C열", watchedOn: "11.09", body: "2층에서 보면 둘이 서 있는 자리가 정확히 대칭이고, 바닥 조명이 계절 색으로 나뉜다. 왼쪽 겨울, 오른쪽 가을." },
    { id: "wg-r9", numberId: "wg-5", author: "봄을기다림", watchedOn: "11.06", body: "유리 깨지는 소리 다음 반 초 정적, 그리고 눈이 쏟아진다. 고음은 눈이 다 떨어질 때까지 버티는 게 연출 의도라고." },
    { id: "wg-r10", numberId: "wg-6", author: "편지는두번", watchedOn: "11.09", body: "새싹 조명이 켜지기 전 3초 암전 동안 도윤의 허밍이 아주 작게 들린다. 앞쪽 자리에서만 들리는 듯." },
  ],
}

const elisabeth: Show = {
  id: "elisabeth",
  title: "엘리자벳",
  venue: "예시 공연장 A",
  todayLabel: "11월 12일 (목) 19:30",
  numbers: [
    {
      id: "el-1",
      order: 1,
      title: "프롤로그",
      scene: "죽은 자들의 세계에서 루케니가 심문을 받고, 당대 인물들이 하나둘 깨어나 엘리자벳의 이야기를 증언하기 시작한다.",
      aiReview:
        "어둠 속에서 인물들이 하나씩 일어나는 프롤로그. 루케니가 심문받으며 이야기를 꺼내는 순간부터, 이 공연이 회상으로 흘러가리라는 게 느껴졌다.",
    },
    {
      id: "el-2",
      order: 2,
      title: "아빠처럼",
      scene: "어린 엘리자벳이 자유로운 아버지처럼 살고 싶다고 노래한다.",
      aiReview:
        "아버지를 바라보는 어린 엘리자벳의 눈빛이 반짝였다. 자유롭게 살고 싶다는 바람이 이 장면에서 처음 드러나서, 뒤의 이야기가 더 아프게 다가왔다.",
    },
    {
      id: "el-3",
      order: 3,
      title: "사랑과 죽음의 론도",
      scene: "높은 곳에서 떨어진 엘리자벳 앞에 죽음(토드)이 처음 모습을 드러내고, 그녀에게 끌린다.",
      aiReview:
        "엘리자벳이 떨어진 뒤 죽음이 처음 등장하던 장면. 죽음이 그녀를 데려가지 않고 돌려보내는 순간, 두 인물의 관계가 시작된다는 긴장이 있었다.",
    },
    {
      id: "el-4",
      order: 4,
      title: "마지막 춤",
      scene: "결혼식 무도회에서 죽음이 나타나 엘리자벳에게 마지막 춤은 자신의 것이라고 경고한다.",
      aiReview:
        "화려한 무도회 한가운데 죽음이 끼어들자 공기가 바뀌었다. 축하의 자리가 순식간에 불안한 예고로 바뀌는 연출이 인상적이었다.",
    },
    {
      id: "el-5",
      order: 5,
      title: "나는 나만의 것",
      scene: "궁정의 규칙에 지친 엘리자벳이 누구의 것도 아닌 자신으로 살겠다고 선언한다.",
      aiReview:
        "혼자 남은 엘리자벳이 자신은 누구의 것도 아니라고 노래하던 장면. 조명이 그녀에게만 모이면서 1막에서 가장 단단한 순간처럼 느껴졌다.",
    },
    {
      id: "el-6",
      order: 6,
      title: "키치",
      scene: "2막이 열리면 루케니가 황실 기념품을 팔며 관객에게 황후의 이미지를 비꼰다.",
      aiReview:
        "2막을 여는 루케니의 장사판. 객석을 향해 기념품을 흔들며 비꼬는 말투 덕분에, 앞선 이야기를 한 걸음 떨어져서 보게 됐다.",
    },
    {
      id: "el-7",
      order: 7,
      title: "그림자는 길어지고",
      scene: "죽음이 황태자 루돌프에게 다가가, 점점 짙어지는 그림자 속으로 이끈다.",
      aiReview:
        "그림자가 무대를 덮어가는 동안 죽음이 루돌프에게 다가갔다. 조명이 조금씩 어두워지는 속도가 인물의 불안과 맞아떨어졌다.",
    },
  ],
  reviews: [
    { id: "el-r1", numberId: "el-1", author: "합스부르크", watchedOn: "11.07", body: "프롤로그에서 인물들이 일어나는 순서가 회차마다 조금 다르다. 오늘은 루케니 목소리가 유난히 거칠어서 시작부터 긴장됐다." },
    { id: "el-r2", numberId: "el-3", author: "토드의그림자", watchedOn: "11.09", body: "죽음이 처음 등장할 때 엘리자벳 쪽으로 손을 뻗다가 거두는 동작이 있다. 이 손짓이 마지막 장면에서 다시 나온다." },
    { id: "el-r3", numberId: "el-4", author: "빈의밤", watchedOn: "11.05", body: "무도회 장면에서 다른 인물들이 멈추고 두 사람만 움직이는 순간이 있는데, 그때 바닥 조명 색이 바뀐다." },
    { id: "el-r4", numberId: "el-5", author: "합스부르크", watchedOn: "11.07", body: "1막 마지막 넘버. 마지막 음을 끌 때 무대 뒤 거울에 비친 모습까지 보이도록 각도가 잡혀 있다." },
    { id: "el-r5", numberId: "el-6", author: "3층의자", watchedOn: "11.10", body: "키치 할 때 객석 통로까지 내려온다. 통로석이면 기념품 받는 연기에 같이 참여하게 될 수도." },
  ],
}

const deathNote: Show = {
  id: "death-note",
  title: "데스노트",
  venue: "예시 공연장 B",
  todayLabel: "11월 12일 (목) 20:00",
  numbers: [
    {
      id: "dn-1",
      order: 1,
      title: "정의는 어디에",
      scene: "모범생 라이토가 범죄가 처벌받지 않는 세상에 대한 회의를 털어놓는다.",
      aiReview:
        "교실 장면에서 라이토가 세상에 정의가 없다고 말하던 순간. 차분한 말투 아래에 분노가 깔려 있어서 앞으로의 선택이 짐작됐다.",
    },
    {
      id: "dn-2",
      order: 2,
      title: "데스노트",
      scene: "사신 류크가 떨어뜨린 노트를 라이토가 줍고, 노트의 규칙을 알게 된다.",
      aiReview:
        "노트를 처음 펼친 라이토의 표정이 호기심에서 확신으로 바뀌어 갔다. 뒤에서 지켜보는 류크의 웃음이 장면을 더 서늘하게 만들었다.",
    },
    {
      id: "dn-3",
      order: 3,
      title: "놈의 마음속으로",
      scene: "탐정 L이 키라의 정체를 추리하며 상대의 생각을 따라 들어간다.",
      aiReview:
        "L이 혼자 웅크린 채 추리를 이어가던 장면. 생각이 빨라질수록 움직임은 작아지는 대비가 인상적이었다.",
    },
    {
      id: "dn-4",
      order: 4,
      title: "테니스 시합",
      scene: "라이토와 L이 테니스 경기를 하며 서로의 속내를 떠본다.",
      aiReview:
        "공이 오갈 때마다 두 사람의 대사도 오갔다. 경기 점수보다 누가 먼저 흔들리는지가 더 궁금해지는 장면이었다.",
    },
    {
      id: "dn-5",
      order: 5,
      title: "마지막 게임",
      scene: "라이토와 L의 대결이 끝을 향해 가고, 한 사람이 쓰러진다.",
      aiReview:
        "끝을 향해 가는 대결에서 무대가 점점 비어 갔다. 한 사람이 쓰러진 뒤 남은 사람의 얼굴이 오래 기억에 남는다.",
    },
  ],
  reviews: [
    { id: "dn-r1", numberId: "dn-2", author: "사과는류크", watchedOn: "11.08", body: "노트를 처음 읽을 때 무대 뒤 스크린에 규칙이 한 줄씩 떠오른다. 2층에서 보면 글자가 더 잘 보인다." },
    { id: "dn-r2", numberId: "dn-3", author: "단것좋아", watchedOn: "11.06", body: "L이 의자 위에 웅크린 자세를 넘버 내내 유지한다. 손가락으로 무릎을 두드리는 박자가 반주랑 맞는다." },
    { id: "dn-r3", numberId: "dn-4", author: "코트사이드", watchedOn: "11.09", body: "테니스 장면은 조명이 공 역할을 한다. 공이 넘어갈 때마다 빛이 반대편으로 옮겨가니 시선 따라가 보세요." },
    { id: "dn-r4", numberId: "dn-5", author: "사과는류크", watchedOn: "11.08", body: "마지막 장면에서 류크가 노트에 뭔가를 적는 소리가 마이크로 크게 들린다. 그 소리가 끝이다." },
  ],
}

const sweeneyTodd: Show = {
  id: "sweeney-todd",
  title: "스위니토드",
  venue: "예시 공연장 C",
  todayLabel: "11월 12일 (목) 19:00",
  numbers: [
    {
      id: "st-1",
      order: 1,
      title: "스위니 토드의 발라드",
      scene: "앙상블이 이발사 스위니 토드의 이야기를 예고하며 막을 연다.",
      aiReview:
        "앙상블이 무대 곳곳에서 스위니 토드의 이름을 부르며 시작했다. 이야기의 결말을 미리 들려주는데도 오히려 더 궁금해졌다.",
    },
    {
      id: "st-2",
      order: 2,
      title: "런던 최악의 파이",
      scene: "파이 가게 주인 러빗 부인이 손님이 없는 가게와 형편없는 파이를 넋두리한다.",
      aiReview:
        "러빗 부인이 밀가루를 날리며 쉴 새 없이 떠들던 장면. 웃기면서도 가난한 가게 사정이 그대로 보여서 묘하게 짠했다.",
    },
    {
      id: "st-3",
      order: 3,
      title: "나의 친구들",
      scene: "토드가 되찾은 면도칼들을 꺼내 들고 오랜 친구를 대하듯 노래한다.",
      aiReview:
        "면도칼을 하나씩 들어 올리는 토드의 손길이 너무 다정해서 오히려 무서웠다. 옆에서 바라보는 러빗 부인의 표정도 기억에 남는다.",
    },
    {
      id: "st-4",
      order: 4,
      title: "에피파니",
      scene: "복수의 기회를 놓친 토드가 분노를 터뜨리며 모든 사람을 향한 복수를 결심한다.",
      aiReview:
        "기회를 놓친 토드가 무너지듯 터져 나오던 순간. 객석을 향해 면도칼을 겨누는 것 같아서 몸이 굳었다.",
    },
    {
      id: "st-5",
      order: 5,
      title: "어 리틀 프리스트",
      scene: "러빗 부인이 섬뜩한 사업 아이디어를 내고, 두 사람이 농담을 주고받으며 1막을 마친다.",
      aiReview:
        "끔찍한 계획을 농담처럼 주고받는 두 사람. 객석에서 웃음이 터질 때마다 웃어도 되나 싶은 기분이 들었다.",
    },
    {
      id: "st-6",
      order: 6,
      title: "내가 곁에 있는 한",
      scene: "토비아스가 러빗 부인을 지키겠다고 약속하며 순수한 마음을 노래한다.",
      aiReview:
        "토비아스의 맑은 목소리가 어두운 이야기 속에서 유일하게 따뜻했다. 그래서 러빗 부인의 흔들리는 눈빛이 더 눈에 들어왔다.",
    },
  ],
  reviews: [
    { id: "st-r1", numberId: "st-1", author: "플리트가", watchedOn: "11.06", body: "발라드 마지막에 호루라기 같은 날카로운 소리가 울리는데, 이 소리가 극 중 장면 전환마다 반복된다." },
    { id: "st-r2", numberId: "st-2", author: "파이한조각", watchedOn: "11.09", body: "반죽을 실제로 치대고 밀가루가 객석 앞줄까지 날린다. 오늘은 바퀴벌레 잡는 동작을 두 번 했다." },
    { id: "st-r3", numberId: "st-4", author: "이발소2층", watchedOn: "11.10", body: "에피파니 때 토드가 객석 쪽으로 걸어 나와 앞줄 관객을 한 명씩 본다. 1층 앞쪽이면 눈 마주칠 각오를." },
    { id: "st-r4", numberId: "st-5", author: "파이한조각", watchedOn: "11.09", body: "직업별 파이 농담을 주고받을 때 애드리브가 매 회차 다르다. 오늘은 관객 웃음 때문에 한 번 멈췄다." },
  ],
}

export const shows: Show[] = [winterGarden, elisabeth, deathNote, sweeneyTodd]

export function getShow(showId: string) {
  return shows.find((s) => s.id === showId) ?? shows[0]
}

/** 지난 회차에 남긴 기록 (비교용 예시 데이터) */
export const seedRecords: ShowRecord[] = [
  {
    id: "rec-1028",
    showId: "winter-garden",
    date: "2026-10-28",
    cast: "해온 이서진 · 도윤 정하람",
    durationSec: 1260,
    entries: [
      { numberId: "wg-2", text: "창문 열 때 찬 바람 효과음이 났다. 혼잣말이 생각보다 담담해서 더 쓸쓸했다.", clue: "ai" },
      { numberId: "wg-4", text: "마지막에 눈 마주칠 때 울컥했다.", clue: "ai" },
      { numberId: "wg-5", text: "눈이 너무 많이 쏟아져서 배우 얼굴이 잘 안 보였다.", clue: "ai" },
    ],
  },
]

export function formatDate(iso: string) {
  const [, m, d] = iso.split("-")
  return `${Number(m)}월 ${Number(d)}일`
}
