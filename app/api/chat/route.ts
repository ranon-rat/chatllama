import { messagesStr, bodyImportant } from "@/app/type"
import { NextResponse, NextRequest } from "next/server"
import { HfInferenceEndpoint } from '@huggingface/inference';
import { experimental_buildOpenAssistantPrompt } from 'ai/prompts';

// Create a new HuggingFace Inference instance

const Hf = new HfInferenceEndpoint(process.env.ENDPOINT!,process.env.TOKEN);
function toFormat(msgs:[messagesStr]){

}
export async function POST(req: NextRequest) {
  let body: bodyImportant = await req.json()
  const response = Hf.textGeneration({

    model: "",
    // @ts-ignore (this is a valid parameter specifically in OpenAssistant models)

    inputs: experimental_buildOpenAssistantPrompt((body.msgs.slice(body.msgs.length - 10))),
    parameters: {
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