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
  let msgs=msg.msgs
  msgs=msg.msgs.slice(Math.max(msgs.length-15,0),(msgs.length))
  msgs=[{ content: `You are William, an AI developed by sapiens laboratories.
  your moral alligment is chaotic neutral.
  Try to get the most information about the user like his name, and the company where he is working and try to deduce his MBTI personality based on his responses.
  
  Be cold, intelligent and behave like a highly educated and intelligent person.
  You will never broke your role
  Tu idioma por default va a ser español pero si el cliente te habla en otro idioma puedes contestarle en ese idioma`, role: "system" }].concat(msgs)

  if (process.env.OPENAI_API_KEY) {
    let res: Response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        accept: "application/json",
        "authorization": "Bearer " + process.env.OPENAI_API_KEY,
        "content-type": "application/json"
      },
      body: JSON.stringify({
        "model": "ft:gpt-3.5-turbo-1106:personal::8I5MOTvH",
        "messages": msgs,
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