import cors from 'cors'
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

console.log(`ai-chat-server - version: ${process.env.APP_VERSION}`)

const app = express()
const port = process.env.PORT || 3000

app.use(express.json())
app.use(cors())

const model = getModel()
console.log(`Loaded Model: ${model.modelId}`)

app.listen(port, () => {
  console.log(`Listening on PORT: ${port}`)
})

app.post('/', async (req: Request, res: Response) => {
  // console.log('req.headers:', req.headers)
  const { messages } = req.body
  const modelMessages = await convertToModelMessages(messages)
  console.log('modelMessages:', modelMessages.length)
  const stream = createUIMessageStream({
    execute: ({ writer }) => {
      const result = streamText({
        model: model,
        messages: modelMessages,
        // system: 'Please respond with short, unique, one sentence acknowledgements.',
        maxOutputTokens: 512,
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
    return google(process.env.MODEL)
  } else if (process.env.MODEL.includes('gpt')) {
    return openai(process.env.MODEL)
  } else {
    return anthropic(process.env.MODEL)
  }
}
