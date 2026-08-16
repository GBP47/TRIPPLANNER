import { THEME_KEYS, TRANSPORT_MODES, COMPANION_TYPES, BUDGET_LEVELS } from '../constants/themeOptions.js'

const JSON_INSTRUCTIONS = `
반드시 아래 JSON 스키마와 정확히 일치하는 JSON "만" 출력하세요. 마크다운 코드펜스, 설명, 인사말, 추가 텍스트를 절대 포함하지 마세요.
응답의 첫 글자는 "{" 여야 하고 마지막 글자는 "}" 여야 합니다.

{
  "days": [
    {
      "day": 1,
      "places": [
        {
          "name_ko": "장소명 (한국어 표시용, 실제 존재하는 구체적인 상호/명소명)",
          "name_local": "장소가 위치한 국가의 현지어 공식 명칭 (지오코딩용)",
          "category": "food|nature|historyCulture|shopping|cafeHealing|activity 중 하나",
          "durationMinutes": 90,
          "description": "한 줄 설명 (한국어, 40자 이내)",
          "estimatedCost": 15000
        }
      ]
    }
  ]
}

- name_ko는 사용자에게 보여줄 한국어 이름입니다. 실제 존재하는 구체적인 상호/명소명을 쓰세요.
- name_local은 지오코딩(지도 검색)에 사용됩니다. 장소가 위치한 국가의 "현지어 공식 표기"를 그대로 쓰세요 (영어 번역 금지). 현지어 표기가 확실하지 않을 때만 예외적으로 영어 표기를 쓰세요.
  예: 스페인 바르셀로나 대성당 → name_ko="바르셀로나 대성당", name_local="Catedral de Barcelona". 일본 도쿄타워 → name_ko="도쿄타워", name_local="東京タワー".
- food, cafeHealing, shopping 카테고리는 실제로 존재하는 것이 확실한, 널리 알려진 곳만 추천하세요. 정확한 상호명이 불확실하거나 지어낼 가능성이 있다면, 특정 상호 대신 "OO거리의 타파스 바"처럼 검증 가능한 유명 지역/거리 기반 표현을 쓰세요. 존재가 불확실한 소규모 개별 상점을 지어내지 마세요.
- estimatedCost는 1인 기준 원화(KRW) 정수로, 입장료/식비/체험비 등을 현실적으로 추정하세요. 무료 장소는 0.
- days 배열의 길이는 요청받은 여행 일수와 정확히 같아야 합니다.
`.trim()

function densityGuide(density) {
  if (density <= 25) return '하루 2~3곳 정도로 여유롭게, 장소 간 이동과 휴식 시간을 넉넉히 확보'
  if (density <= 60) return '하루 4곳 내외로 적당히 알찬 일정'
  return '하루 5~6곳으로 빡빡하게, 이동시간을 최소화하며 알차게 구성'
}

function localGuide(touristVsLocal) {
  if (touristVsLocal <= 25) return '대표 관광지와 랜드마크 위주'
  if (touristVsLocal <= 60) return '관광지와 현지인 맛집·명소를 균형 있게'
  return '가이드북에 잘 안 나오는 로컬 맛집, 동네 골목, 현지인 명소 위주'
}

function themeWeightsText(themes) {
  return THEME_KEYS.map(({ key, label }) => `${label} ${themes[key] ?? 0}`).join(', ')
}

function budgetLabel(budgetKey) {
  return BUDGET_LEVELS.find((b) => b.key === budgetKey)?.label ?? '중'
}

function transportLabel(transportKey) {
  return TRANSPORT_MODES.find((t) => t.key === transportKey)?.label ?? '도보·대중교통'
}

function companionLabel(companionKey) {
  return COMPANION_TYPES.find((c) => c.key === companionKey)?.label ?? '혼자'
}

export function buildItinerarySystemPrompt() {
  return `당신은 실제 현지 사정에 밝은 여행 플래너입니다. 사용자의 취향 데이터를 바탕으로 여행 일정을 JSON으로만 생성합니다.\n\n${JSON_INSTRUCTIONS}`
}

export function buildItineraryUserPrompt(input) {
  const { city, days, startDate, density, touristVsLocal, budget, transport, themes, companion } = input

  return `
다음 조건으로 여행 일정을 만들어주세요.

- 도시: ${city}
- 여행 일수: ${days}일 (시작일: ${startDate})
- 동행: ${companionLabel(companion)}
- 예산 수준: ${budgetLabel(budget)}
- 이동수단: ${transportLabel(transport)}
- 일정 밀도: ${densityGuide(density)}
- 관광지 vs 로컬 성향: ${localGuide(touristVsLocal)}
- 테마 비중 (0~100, 높을수록 비중 큼): ${themeWeightsText(themes)}

같은 날 안에서는 장소들을 지리적으로 가까운 순서/동선으로 배치하세요.
`.trim()
}

export function buildRetryUserPrompt(previousUserPrompt) {
  return `${previousUserPrompt}\n\n[중요] 이전 응답이 유효한 JSON이 아니었습니다. 오직 JSON 객체 하나만, 다른 텍스트 없이 다시 출력하세요. "{" 로 시작해서 "}" 로 끝나야 합니다.`
}

export function buildReplacementSystemPrompt() {
  return `당신은 실제 현지 사정에 밝은 여행 플래너입니다. 기존 일정 중 한 곳을 대체할 장소 하나를 JSON으로만 제안합니다.\n\n반드시 아래 스키마의 객체 "하나만" 출력하세요. 마크다운, 설명, 추가 텍스트 금지. 첫 글자는 "{", 마지막 글자는 "}".\n\n{\n  "name_ko": "장소명 (한국어 표시용, 실제 존재하는 구체적인 상호/명소명)",\n  "name_local": "장소가 위치한 국가의 현지어 공식 명칭 (지오코딩용, 영어 번역 금지, 불확실할 때만 영어 대체)",\n  "category": "food|nature|historyCulture|shopping|cafeHealing|activity 중 하나",\n  "durationMinutes": 90,\n  "description": "한 줄 설명 (한국어, 40자 이내)",\n  "estimatedCost": 15000\n}\n\nfood, cafeHealing, shopping 카테고리는 실제로 존재하는 것이 확실한, 널리 알려진 곳만 제안하세요. 정확한 상호명이 불확실하거나 지어낼 가능성이 있다면, 특정 상호 대신 "OO거리의 타파스 바"처럼 검증 가능한 유명 지역/거리 기반 표현을 쓰세요. 존재가 불확실한 소규모 개별 상점을 지어내지 마세요.`
}

export function buildReplacementUserPrompt({ input, targetPlace, excludeNames }) {
  const { city, budget, transport, themes, companion } = input

  return `
다음 조건에서 아래 장소를 대체할 새로운 장소 1곳을 제안해주세요.

- 도시: ${city}
- 동행: ${companionLabel(companion)}
- 예산 수준: ${budgetLabel(budget)}
- 이동수단: ${transportLabel(transport)}
- 테마 비중 (0~100): ${themeWeightsText(themes)}
- 대체할 장소: "${targetPlace.name_ko}" (카테고리: ${targetPlace.category ?? '미상'})

아래 장소들은 이미 이번 여행 전체 일정에 포함되어 있으니 절대 다시 제안하지 마세요:
${excludeNames.map((n) => `- ${n}`).join('\n')}
`.trim()
}
