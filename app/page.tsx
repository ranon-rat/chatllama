"use client"
import { FormEvent, useEffect, useRef, useState } from 'react'
import { messagesStr, bodyImportant } from './type'
/*function addMessage(msg: messagesStr) {
  let text = document.createElement("div")
  text.className = "whitespace-pre-wrap"
  text.innerText = (msg.role === 'user' ? 'User: ' : 'AI: ') + msg.content
  document.getElementById("messages")?.appendChild(text)
}*/

/*async function onSubmit(e: FormEvent, messages: messagesStr[]) {
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
}*/

function onEnterPress(e: any) {
  if (e.keyCode == 13 && e.shiftKey == false) {
    e.preventDefault();
    (document.getElementById("chat-submit") as HTMLInputElement).click();
  }
}

export default function Home() {
  // i need to get, the messages, input and
  const [messages, setMessages] = useState<messagesStr[]>([])

  function onSubmit(e: FormEvent, messages: messagesStr[]) {
    e.preventDefault();

    const chatSubmit = document.getElementById("chat-submit") as HTMLInputElement;
    const chat = document.getElementById("chat") as HTMLInputElement;

    const chatUserMessage = chat?.value;

    const model = document.getElementById("model") as HTMLInputElement;
    const modelType = model?.value;

    if (!chatUserMessage) return;

    messages.push({ content: chatUserMessage, role: "user" })
    setMessages(messages)

    // disable chat
    chat.disabled = true;
    chat.classList.add("disabled:cursor-not-allowed")
    chat.classList.add("disabled:bg-gray-200")
    chat.classList.add("disabled:text-gray-500")

    // disable the button
    chatSubmit.disabled = true;
    chatSubmit.classList.remove("text-blue-600")
    chatSubmit.classList.add("text-gray-600")
    

    fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: modelType,
        msgs: messages,
        chat: chatUserMessage,
      })
    })
      .then(
        res => {
          console.log(res)

          return res.json()
        }
      )
      .then(res => {
        setMessages([...messages, res])
      })
      .catch(
        err => {
          messages.pop()
          setMessages(messages)

          console.log(err)
        }
      )
      .finally(() => {
        chat.value = ""

        // enable chat
        chat.disabled = false;
        chat.classList.remove("disabled:cursor-not-allowed")
        chat.classList.remove("disabled:bg-gray-200")
        chat.classList.remove("disabled:text-gray-500")

        // enable the button
        chatSubmit.disabled = false;
        chatSubmit.classList.remove("text-gray-600")
        chatSubmit.classList.add("text-blue-600")
      })

    /*const msg = { content: (e.target as any).chat.value, role: "user" };
    const model = (document.getElementById("model") as HTMLInputElement)?.value;

    console.log(msg, model)

    setMessages([...messages, msg]);
    (e.target as any).chat.value = ""

    const body: bodyImportant = {
      model: model,
      msgs: messages
    }

    fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",

      },
      body: JSON.stringify(body)
    })
      .then(res => res.text())
      .then(res => { console.log(res); return res })
      .then(res => setMessages([...messages, JSON.parse(res)]))
      .catch(err => console.log(err))*/
  }

  return (
    <div className="flex flex-col p-4 h-screen">
      <div className="flex flex-col border border-gray-300 bg-white p-2">
        <h2 className="font-semibold">Configuration</h2>

        <hr className="w-full border-gray-200 my-4" />

        <form>
          <div className="">
            <label htmlFor="model" className="font-semibold text-sm font-medium">Model</label>
            <input
              type="url"
              id="model"
              className="border border-gray-300 rounded-lg text-xs lg:text-sm w-full py-2.5"
              placeholder="/accounts/fireworks/models/llama-v2-70b-chat"
              required
            />
          </div>
        </form>
      </div>

      <div className="flex flex-col mt-auto">
        <div className="flex flex-col my-1 overflow-auto" id="messages">
          {messages.map((msg, index) => (
            <div key={index} className="border border-gray-300 bg-white my-1 p-2">
              <span className="font-semibold text-xs lg:text-sm">{msg.role}</span>
              <p>{msg.content}</p>
            </div>
          ))}
        </div>

        <form className="flex flex-col" onSubmit={(e) => onSubmit(e, messages)}>
          <label htmlFor="chat" className="sr-only">Your message</label>
          <div className="flex items-center rounded-lg">
            <textarea
              id="chat"
              rows={2}
              className="w-full my-1 p-2.5 text-sm lg:text-base text-gray-900 bg-white border border-gray-300 focus:ring-blue-500 focus:border-blue-500 placeholder-gray-400 placeholder-gray-400 resize-none overflow-hidden"
              style={{ resize: 'none' }}
              placeholder="Your message..."
              onKeyDown={onEnterPress}
            ></textarea>
            <button
              type="submit"
              id="chat-submit"
              className="p-2 my-1 text-blue-600 rounded-full cursor-pointer hover:bg-blue-100"
            >
              <svg
                className="w-6 h-6 rotate-90"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z"
                ></path>
              </svg>
            </button>
          </div>
        </form>
      </div>
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
