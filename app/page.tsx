"use client"
import { FormEvent, useState } from 'react'
import { messagesStr, bodyImportant } from './type'
function addMessage(msg: messagesStr) {
  let text = document.createElement("div")
  text.className = "whitespace-pre-wrap"
  text.innerText = (msg.role === 'user' ? 'User: ' : 'AI: ') + msg.content
  document.getElementById("messages")?.appendChild(text)
}
async function onSubmit(e: FormEvent, messages: messagesStr[]) {
  e.preventDefault();
  const msg = { content: (e.target as any).message.value, role: "user" };
  const model = (document.getElementById("model") as HTMLInputElement)?.value;
  addMessage(msg);
  messages.push(msg);
  (e.target as any).message.value = ""
  let body: bodyImportant = {
    model: model,
    msgs: messages
  }
  let res = await fetch("/api/chat", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",

    },
    body: JSON.stringify(body)
  });
  let response = await res.json() as messagesStr;
  addMessage(response)
  messages.push(response);
}
export default function Home() {
  // i need to get, the messages, input and
  let [messages] = useState([] as messagesStr[])

  return (
    <div>
      <form>
        <div className="mb-6">
          <label for="password" className="block mb-2 text-sm font-medium">Your password</label>
          <input type="password" id="password" className="border border-gray-300 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required />
        </div>
        <div>
          <label for="message" className="block mb-2 text-sm font-medium">Your message</label>
          <textarea id="message" rows="4" className="block p-2.5 w-full text-sm rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Leave a comment..."></textarea>
        </div>
        <button type="submit" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Submit</button>
      </form>
    </div>
  )

  /*return (
    <div className="flex flex-col w-full max-w-md py-24 mx-auto stretch">
      <div id="messages">
        {messages.length > 0
          ? messages.map(m => (
            <div key={""} className="whitespace-pre-wrap">
              {m.role === 'user' ? 'User: ' : 'AI: '}
              {m.content}
            </div>
          ))
          : null}
      </div>


      <form onSubmit={(e) => onSubmit(e, messages)} className=" " >


        <input
          id="message"

          placeholder="Say something..."
          className="fixed bottom-0  border border-gray-300 rounded shadow-xl text-black w-full max-w-md p-2 mb-8"
        />


      </form>
      <input id="model"
        placeholder="accounts/fireworks/models/llama-v2-70b-chat"
        className=" border border-gray-300 rounded shadow-xl text-black w-full max-w-md p-2 mb-8"
      />

    </div>
  )*/
}
