import { messagesStr, bodyImportant } from "@/app/type"
import { NextResponse, NextRequest } from "next/server"

export async function POST(req: NextRequest) {
  let body: bodyImportant = await req.json()

  if (process.env.OPENAI_API_KEY) {
    let res: Response = await fetch("https://api.fireworks.ai/inference/v1/chat/completions", {
      method: "POST",
      headers: {

        accept: "application/json",
        "authorization": "Bearer " + process.env.OPENAI_API_KEY,
        "content-type": "application/json"
      },
      body: JSON.stringify({

        "messages": body.msgs,
        "temperature": 1,
        "top_p": 1,
        "n": 1,
        "stream": false,
        "max_tokens": 200,
        "model": body.model || "accounts/fireworks/models/llama-v2-70b-chat"

      })

    })
    return NextResponse.json(((await res.json()) as any)?.choices[0]?.message as messagesStr)
  }

  return NextResponse.json({ content: "system error", role: "system" })
}