import { messagesStr } from "@/app/type"
import { NextResponse, NextRequest } from "next/server"


export async function POST(req: NextRequest) {
  let msg: messagesStr[] = await req.json()
  console.log(msg)
  if (process.env.OPENAI_API_KEY) {
    let res: Response = await fetch("https://api.fireworks.ai/inference/v1/chat/completions", {
      method: "POST",
      headers: {

        accept: "application/json",
        "authorization": "Bearer "+process.env.OPENAI_API_KEY,
        "content-type": "application/json"
      },
      body: JSON.stringify({

        "messages": msg,
        "temperature": 1,
        "top_p": 1,
        "n": 1,
        "stream": false,
        "max_tokens": 200,
        "model": "accounts/fireworks/models/llama-v2-70b-chat"

      })

    })
    return NextResponse.json( ((await res.json()) as any).choices[0].message as messagesStr)
  }

  return NextResponse.json({ content: "system error", role: "system" })
}