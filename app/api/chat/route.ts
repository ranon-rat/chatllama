import { messagesStr, bodyImportant,audioMsg } from "@/app/type";
import { NextResponse, NextRequest } from "next/server";

async function toBase64(arrayBuffer: ArrayBuffer) {
  let uint8Array = new Uint8Array(arrayBuffer);
  return Buffer.from(uint8Array).toString('base64');
}
async function tts(input:string) {
  try {
      const response = await fetch("https://api.openai.com/v1/audio/speech", {
          method: 'POST',
          headers: {
              'Authorization': `Bearer ${ process.env.OPENAI_API_KEY}`,
              'Content-Type': 'application/json'
          },
          body: JSON.stringify({

              model: "tts-1",
              input: input,
              voice: "onyx"
          })
      });

      if (!response.ok) {
          return ""
      }

      const arrayBuffer = await response.arrayBuffer();
      const base64String = await toBase64(arrayBuffer);
      return "data:audio/mp3;base64,"+base64String
  } catch (error) {
      console.error('Error:', error);
      return ""
  }
}

export async function POST(req: NextRequest) {
  let msg:  bodyImportant = await req.json()
  msg.msgs=msg.msgs.slice(0,Math.min(15,msg.msgs.length))
  if (process.env.OPENAI_API_KEY) {
    let res: Response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        accept: "application/json",
        "authorization": "Bearer " + process.env.OPENAI_API_KEY,
        "content-type": "application/json"
      },
      body: JSON.stringify({
        "model": "gpt-4",
        "messages": msg.msgs,
        "temperature": 0.7,
        "top_p": 1,
        "n": 1,
        "stream": false,
        "max_tokens": 200
      })
    })
    let m=((await res.json()) as any).choices[0].message as messagesStr
    console.log(m)
    return NextResponse.json({msg:m, audio:await tts(m.content)} as audioMsg)
  }

  return NextResponse.json({msg:{ content: "system error", role: "assistant" }} as audioMsg)
}