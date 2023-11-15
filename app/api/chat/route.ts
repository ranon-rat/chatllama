import { messagesStr, bodyImportant } from "@/app/type"
import { NextResponse, NextRequest } from "next/server"
import { HfInferenceEndpoint } from '@huggingface/inference';

// Create a new HuggingFace Inference instance

const Hf = new HfInferenceEndpoint(process.env.ENDPOINT!,process.env.TOKEN);
const systemPrompt=process.env.SYSTEM_PROMPT
function toFormat(msgs:[messagesStr]){
return   msgs.reduce((text,msg) => text +`<|${msg.role}|>\n${msg.content}\n</s>\n`, `<|system|>\n${systemPrompt}\n</s>\n`)+`<|assistant|>\n`;


}
export async function POST(req: NextRequest) {
  let body: bodyImportant = await req.json()
  const response = Hf.textGeneration({

    model: "",
    // @ts-ignore (this is a valid parameter specifically in OpenAssistant models)

    inputs: toFormat(body.msgs.slice(-11)),
    parameters: {
      temperature:0.5,
      max_new_tokens: 200,
      // @ts-ignore (this is a valid parameter specifically in OpenAssistant models)
      typical_p: 0.2,
      repetition_penalty: 1,
      truncate: 1000,
      return_full_text: false,
    },
  }).catch(e=>console.log(process.env.ENDPOINT,process.env.TOKEN));

  return NextResponse.json({ content: (await response as any)?.generated_text?.replace(/\<[\d\D]+\>/g,""), role: "assistant" })


}