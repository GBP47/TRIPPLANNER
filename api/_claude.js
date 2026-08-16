import Anthropic from '@anthropic-ai/sdk'

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
const MODEL = process.env.ANTHROPIC_MODEL || 'claude-sonnet-5'

export async function callClaude({ system, userPrompt, maxTokens, timeoutMs = 25000 }) {
  let message
  try {
    message = await anthropic.messages.create(
      {
        model: MODEL,
        max_tokens: maxTokens,
        system,
        messages: [{ role: 'user', content: userPrompt }],
      },
      { timeout: timeoutMs, maxRetries: 1 },
    )
  } catch (err) {
    if (err?.name === 'APIConnectionTimeoutError' || err?.constructor?.name === 'APIConnectionTimeoutError') {
      throw new Error('AI 응답 시간이 초과되었습니다. 잠시 후 다시 시도해주세요.')
    }
    throw err
  }

  return message.content
    .filter((block) => block.type === 'text')
    .map((block) => block.text)
    .join('')
}

export function extractJson(text) {
  const trimmed = text.trim()
  const start = trimmed.indexOf('{')
  const end = trimmed.lastIndexOf('}')
  if (start === -1 || end === -1 || end < start) return null

  try {
    return JSON.parse(trimmed.slice(start, end + 1))
  } catch {
    return null
  }
}
