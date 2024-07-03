
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
                input: "hola negros aqui el loquendero 2005 viniendo para presentarles 2 razones por las cuales cristo es rey.",
                voice: "alloy"
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
