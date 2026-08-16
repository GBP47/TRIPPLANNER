import { callClaude, extractJson } from './_claude.js'
import {
  buildItinerarySystemPrompt,
  buildItineraryUserPrompt,
  buildRetryUserPrompt,
  buildReplacementSystemPrompt,
  buildReplacementUserPrompt,
} from '../src/lib/promptBuilder.js'
import { parseItinerary, parseReplacementPlace } from '../src/lib/itinerarySchema.js'

async function generateWithRetry({ system, userPrompt, maxTokens, parse, timeoutMs }) {
  let text = await callClaude({ system, userPrompt, maxTokens, timeoutMs })
  let parsed = parse(extractJson(text))

  if (!parsed.success) {
    text = await callClaude({ system, userPrompt: buildRetryUserPrompt(userPrompt), maxTokens, timeoutMs })
    parsed = parse(extractJson(text))
  }

  return parsed
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' })
    return
  }

  if (!process.env.ANTHROPIC_API_KEY) {
    res.status(500).json({ error: '서버에 ANTHROPIC_API_KEY가 설정되지 않았습니다.' })
    return
  }

  const { mode, input, targetPlace, excludeNames } = req.body || {}

  try {
    if (mode === 'replace') {
      if (!input || !targetPlace) {
        res.status(400).json({ error: '잘못된 요청입니다.' })
        return
      }

      const system = buildReplacementSystemPrompt()
      const userPrompt = buildReplacementUserPrompt({ input, targetPlace, excludeNames: excludeNames || [] })
      const parsed = await generateWithRetry({
        system,
        userPrompt,
        maxTokens: 512,
        parse: parseReplacementPlace,
        timeoutMs: 15000,
      })

      if (!parsed.success) {
        res.status(422).json({ error: 'AI가 유효한 대체 장소를 생성하지 못했습니다. 다시 시도해주세요.' })
        return
      }

      res.status(200).json(parsed.data)
      return
    }

    if (!input) {
      res.status(400).json({ error: '잘못된 요청입니다.' })
      return
    }

    const system = buildItinerarySystemPrompt()
    const userPrompt = buildItineraryUserPrompt(input)
    const parsed = await generateWithRetry({
      system,
      userPrompt,
      maxTokens: 4096,
      parse: parseItinerary,
      timeoutMs: 25000,
    })

    if (!parsed.success) {
      res.status(422).json({ error: 'AI가 유효한 일정을 생성하지 못했습니다. 다시 시도해주세요.' })
      return
    }

    res.status(200).json(parsed.data)
  } catch (err) {
    res.status(502).json({ error: `AI 호출에 실패했습니다: ${err.message}` })
  }
}
