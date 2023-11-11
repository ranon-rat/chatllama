const { HfInference } =require( '@huggingface/inference');
const { HuggingFaceStream, StreamingTextResponse } =require ('ai');
const { experimental_buildOpenAssistantPrompt } =require( 'ai/prompts');

const Hf = new HfInference("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",{
    url: "https://zlre8rah4d2bbwe2.us-east-1.aws.endpoints.huggingface.cloud/"
});

const response = Hf.textGeneration({
    model: 'OpenAssistant/oasst-sft-4-pythia-12b-epoch-3.5',
    inputs: "hola mundo",
    parameters: {
      max_new_tokens: 200,
      // @ts-ignore (this is a valid parameter specifically in OpenAssistant models)
      typical_p: 0.2,
      repetition_penalty: 1,
      truncate: 1000,
      return_full_text: false,
    },
  });

async function main(){
console.log((await response).generated_text)}
main()