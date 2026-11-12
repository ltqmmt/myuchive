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
  date: string
  cast: string
  entries: RecordEntry[]
  durationSec: number
}

export const show = {
  title: "겨울 정원",
  venue: "달빛아트홀",
  today: "2026-11-12",
  todayLabel: "11월 12일 (목) 19:30",
  cast: "해온 이서진 · 도윤 박건우",
}

export const numbers: MusicalNumber[] = [
  {
    id: "n1",
    order: 1,
    title: "서곡 – 첫눈",
    scene: "막이 오르면 텅 빈 온실에 눈이 내리고, 정원사 해온이 얼어붙은 화분을 하나씩 닦는다.",
    aiReview:
      "막이 오르자마자 온실 유리 너머로 눈이 내렸다. 해온이 화분을 하나씩 닦는 손이 유난히 느려서, 대사 없이도 이곳에 오래 혼자 있었다는 게 느껴졌다.",
  },
  {
    id: "n2",
    order: 2,
    title: "아무도 오지 않는 정원",
    scene: "해온이 객석 쪽 창문을 열고 \"올해도 봄은 늦겠지\"라고 혼잣말한 뒤 첫 솔로를 부른다.",
    aiReview:
      "\"올해도 봄은 늦겠지\"라는 혼잣말 뒤에 시작된 첫 솔로. 창문을 객석 쪽으로 열어서, 마치 관객에게 말을 거는 것처럼 들렸다.",
  },
  {
    id: "n3",
    order: 3,
    title: "편지",
    scene: "해온이 형 도윤이 남긴 편지를 발견한다. 편지를 읽는 동안 조명이 반으로 나뉘고, 반대편에서 도윤이 같은 문장을 노래한다.",
    aiReview:
      "편지를 읽는 해온과 반대편에서 같은 문장을 부르는 도윤. 조명이 무대를 반으로 가르는 순간, 두 사람이 같은 시간에 있지 않다는 걸 알게 됐다.",
  },
  {
    id: "n4",
    order: 4,
    title: "두 개의 계절",
    scene: "형제가 무대 양끝에서 서로를 보지 못한 채 화음을 쌓고, 마지막 소절에서 처음으로 눈을 맞춘다.",
    aiReview:
      "무대 양끝에서 서로를 보지 못한 채 쌓이던 화음. 마지막 소절에서 처음 눈이 마주쳤을 때 객석 전체가 숨을 멈춘 것 같았다.",
  },
  {
    id: "n5",
    order: 5,
    title: "겨울이 끝나는 법",
    scene: "해온이 온실 천장의 유리를 깨고, 쏟아지는 눈 속에서 클라이맥스를 부른다.",
    aiReview:
      "천장 유리가 깨지고 눈이 한꺼번에 쏟아지던 클라이맥스. 해온이 위를 올려다보며 고음을 버티는 동안 무대가 하얗게 덮였다.",
  },
  {
    id: "n6",
    order: 6,
    title: "커튼콜 – 봄의 첫 잎",
    scene: "모든 조명이 꺼지고, 무대 중앙 화분의 작은 새싹 하나만 빛을 받는다.",
    aiReview:
      "모든 조명이 꺼지고 화분 속 새싹 하나만 남았다. 박수가 나오기까지 몇 초의 정적이 있었는데, 그 정적까지 공연의 일부처럼 느껴졌다.",
  },
]

export const reviews: AudienceReview[] = [
  { id: "r1", numberId: "n1", author: "겨울관객", watchedOn: "11.08", body: "화분 닦을 때 입김이 보이도록 조명을 낮춘 게 좋았다. 오른쪽 세 번째 화분만 끝까지 안 닦는데, 그게 형의 화분이라는 걸 나중에 알았다." },
  { id: "r2", numberId: "n1", author: "온실지기", watchedOn: "11.05", body: "서곡 첫 음이 첼로 솔로로 시작해서 눈 떨어지는 속도랑 박자가 맞는다. 처음 보는 분들은 눈 내리는 타이밍을 꼭 보세요." },
  { id: "r3", numberId: "n2", author: "2층C열", watchedOn: "11.09", body: "\"올해도 봄은 늦겠지\" 하고 창문 닫으려다 멈추는 손. 오늘 이서진 배우는 창틀에 이마를 잠깐 대고 있다가 노래를 시작했다." },
  { id: "r4", numberId: "n2", author: "봄을기다림", watchedOn: "11.06", body: "솔로 2절에서 '아무도'를 반 박자 늦게 부르는데 회차마다 길이가 다르다. 오늘은 거의 한 마디를 쉬었다." },
  { id: "r5", numberId: "n3", author: "편지는두번", watchedOn: "11.09", body: "편지 마지막 줄 '창문은 열어둬'를 해온은 읽기만 하고 도윤만 노래한다. 그다음 해온이 2막 내내 창문을 열어두는 게 이 장면 때문." },
  { id: "r6", numberId: "n3", author: "겨울관객", watchedOn: "11.08", body: "조명이 갈라질 때 무대 바닥에 선이 그어지는데, 도윤이 그 선을 한 번 밟으려다 물러난다. 놓치기 쉬운 동작." },
  { id: "r7", numberId: "n4", author: "온실지기", watchedOn: "11.05", body: "눈 맞추는 마지막 소절에서 둘 다 숨을 같이 쉰다. 마이크로 들릴 만큼 크게. 오늘은 박건우 배우가 먼저 웃었다." },
  { id: "r8", numberId: "n4", author: "2층C열", watchedOn: "11.09", body: "2층에서 보면 둘이 서 있는 자리가 정확히 대칭이고, 바닥 조명이 계절 색으로 나뉜다. 왼쪽 겨울, 오른쪽 가을." },
  { id: "r9", numberId: "n5", author: "봄을기다림", watchedOn: "11.06", body: "유리 깨지는 소리 다음 반 초 정적, 그리고 눈이 쏟아진다. 고음은 눈이 다 떨어질 때까지 버티는 게 연출 의도라고." },
  { id: "r10", numberId: "n6", author: "편지는두번", watchedOn: "11.09", body: "새싹 조명이 켜지기 전 3초 암전 동안 도윤의 허밍이 아주 작게 들린다. 앞쪽 자리에서만 들리는 듯." },
]

/** 지난 회차에 남긴 기록 (비교용 예시 데이터) */
export const seedRecords: ShowRecord[] = [
  {
    id: "rec-1028",
    date: "2026-10-28",
    cast: "해온 이서진 · 도윤 정하람",
    durationSec: 1260,
    entries: [
      { numberId: "n2", text: "창문 열 때 찬 바람 효과음이 났다. 혼잣말이 생각보다 담담해서 더 쓸쓸했다.", clue: "ai" },
      { numberId: "n4", text: "마지막에 눈 마주칠 때 울컥했다.", clue: "ai" },
      { numberId: "n5", text: "눈이 너무 많이 쏟아져서 배우 얼굴이 잘 안 보였다.", clue: "ai" },
    ],
  },
]

export function formatDate(iso: string) {
  const [, m, d] = iso.split("-")
  return `${Number(m)}월 ${Number(d)}일`
}
