import cors from 'cors'
import dotenv from 'dotenv'
import express, { Request, Response } from 'express'
import { anthropic } from '@ai-sdk/anthropic'
import { google } from '@ai-sdk/google'
import { openai } from '@ai-sdk/openai'
import {
  streamText,
  createUIMessageStream,
  pipeUIMessageStreamToResponse,
  convertToModelMessages,
} from 'ai'

dotenv.config({ path: 'settings.env' })

console.log(`ai-chat-server: ${process.env.APP_VERSION}`)

if (process.env.AI_SDK_LOG_WARNINGS) globalThis.AI_SDK_LOG_WARNINGS = false
console.log('AI_SDK_LOG_WARNINGS:', process.env.AI_SDK_LOG_WARNINGS)

console.log('ANTHROPIC_API_KEY:', process.env.ANTHROPIC_API_KEY ? 'SET' : undefined)
console.log('OPENAI_API_KEY:', process.env.OPENAI_API_KEY ? 'SET' : undefined)
console.log(
  'GOOGLE_GENERATIVE_AI_API_KEY:',
  process.env.GOOGLE_GENERATIVE_AI_API_KEY ? 'SET' : undefined,
)

const maxOutputTokens = process.env.MAX_TOKENS
  ? Number.parseInt(process.env.MAX_TOKENS)
  : undefined
console.log(`maxOutputTokens: ${maxOutputTokens}`)
console.log(`system (instructions): ${process.env.INSTRUCTIONS}`)

const model = getModel()
console.log(`Loaded modelId: ${model.modelId}`)

const providerOptions = getProviderOptions(model.modelId)
console.log('providerOptions:', providerOptions)

const app = express()
const port = process.env.PORT || 3000 // NOSONAR

app.use(express.json())
app.use(cors())

app.listen(port, () => console.log(`Listening on PORT: ${port}`))

// app.get('/app-health-check', (_req, res) => res.sendStatus(200))

app.post('/', async (req: Request, res: Response) => {
  // console.log('req.headers:', req.headers)
  // console.log('authorization:', req.headers.authorization)
  const { messages, system } = req.body
  // if (system) console.log('system:', system.substring(0, 512))
  const modelMessages = await convertToModelMessages(messages)
  console.log('modelMessages:', modelMessages.length)
  const stream = createUIMessageStream({
    execute: ({ writer }) => {
      const result = streamText({
        model: model,
        messages: modelMessages,
        system: system || process.env.INSTRUCTIONS,
        maxOutputTokens,
        providerOptions,
      })
      writer.merge(result.toUIMessageStream())
    },
  })
  // console.log('stream:', stream)
  pipeUIMessageStreamToResponse({ response: res, stream })
})

function getModel() {
  if (!process.env.MODEL) throw new Error('Missing Environment Variable: MODEL')
  if (process.env.MODEL.startsWith('gemini')) {
    if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY)
      throw new Error('Missing GOOGLE_GENERATIVE_AI_API_KEY')
    return google(process.env.MODEL)
  } else if (process.env.MODEL.includes('gpt')) {
    if (!process.env.OPENAI_API_KEY) throw new Error('Missing OPENAI_API_KEY')
    return openai(process.env.MODEL)
  } else {
    if (!process.env.ANTHROPIC_API_KEY) throw new Error('Missing ANTHROPIC_API_KEY')
    return anthropic(process.env.MODEL)
  }
}

function getProviderOptions(modelId: string) {
  let reasoningEffort = 'low'
  if (/^gpt-5(-|$)/.test(modelId)) {
    reasoningEffort = 'minimal'
  } else if (modelId.startsWith('gpt-5.')) {
    reasoningEffort = 'none'
  }
  return {
    openai: {
      serviceTier: 'flex',
      reasoningEffort,
      ...(modelId.includes('gpt-5-nano') && { include: ['reasoning.encrypted_content'] }),
    },
  }
}
