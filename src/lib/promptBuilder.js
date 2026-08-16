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
          "name": "장소명 (실제 존재하는 구체적인 상호/명소명)",
          "category": "food|nature|historyCulture|shopping|cafeHealing|activity 중 하나",
          "durationMinutes": 90,
          "description": "한 줄 설명 (한국어, 40자 이내)",
          "estimatedCost": 15000
        }
      ]
    }
  ]
}

- name은 지오코딩이 가능하도록 실제 존재하는 장소의 정확한 이름으로 작성하세요.
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
  return `당신은 실제 현지 사정에 밝은 여행 플래너입니다. 기존 일정 중 한 곳을 대체할 장소 하나를 JSON으로만 제안합니다.\n\n반드시 아래 스키마의 객체 "하나만" 출력하세요. 마크다운, 설명, 추가 텍스트 금지. 첫 글자는 "{", 마지막 글자는 "}".\n\n{\n  "name": "장소명 (실제 존재하는 구체적인 상호/명소명)",\n  "category": "food|nature|historyCulture|shopping|cafeHealing|activity 중 하나",\n  "durationMinutes": 90,\n  "description": "한 줄 설명 (한국어, 40자 이내)",\n  "estimatedCost": 15000\n}`
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
- 대체할 장소: "${targetPlace.name}" (카테고리: ${targetPlace.category ?? '미상'})

아래 장소들은 이미 이번 여행 전체 일정에 포함되어 있으니 절대 다시 제안하지 마세요:
${excludeNames.map((n) => `- ${n}`).join('\n')}
`.trim()
}
