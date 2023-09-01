"use client"
import { FormEvent, useState } from 'react'
import { messagesStr } from './type'
function addMessage(msg: messagesStr) {
  let text = document.createElement("div")
  text.className = "whitespace-pre-wrap"
  text.innerText = (msg.role === 'user' ? 'User: ' : 'AI: ') + msg.content
  document.getElementById("messages")?.appendChild(text)

}
async function onSubmit(e: FormEvent, messages: messagesStr[]) {
  e.preventDefault();
  const msg = { content: (e.target as any).message.value, role: "user" };
  addMessage(msg)
  messages.push(msg);
  (e.target as any).message.value = ""

  let res = await fetch("/api/chat", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      
    },
    body: JSON.stringify(messages)
  });
  let response = await res.json() as messagesStr;
  addMessage(response )
  messages.push(response);
}
export default function Home() {
  // i need to get, the messages, input and
  let [messages] = useState([] as messagesStr[])

  return (
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
      <form onSubmit={(e) => onSubmit(e, messages)}>
        <input
          id="message"
          className="fixed bottom-0 w-full max-w-md p-2 mb-8 border border-gray-300 rounded shadow-xl text-black"
          placeholder="Say something..."
        />
      </form>
    </div>
  )
}
