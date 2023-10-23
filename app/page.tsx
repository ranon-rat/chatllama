"use client";
import { FormEvent, useEffect, useState } from "react";
import { messagesStr } from "./type";

export default function Home() {
  // i need to get, the messages, input and
  const [messages, setMessages] = useState<messagesStr[]>([]);

  function onEnterPress(e: any) {
    if (e.keyCode == 13 && e.shiftKey == false) {
      e.preventDefault();
      (document.getElementById("chat-submit") as HTMLInputElement).click();
    }
  }

  function disableChat() {
    const chatSubmit = document.getElementById(
      "chat-submit"
    ) as HTMLInputElement;
    const chatTextarea = document.getElementById(
      "chat-textarea"
    ) as HTMLInputElement;

    // disabble textarea
    chatTextarea.disabled = true;
    chatTextarea.classList.add("disabled:cursor-not-allowed");
    chatTextarea.classList.add("disabled:bg-gray-200");
    chatTextarea.classList.add("disabled:text-gray-500");

    // disable submit button
    chatSubmit.disabled = true;
    chatSubmit.classList.remove("text-blue-600");
    chatSubmit.classList.add("text-gray-600");
  }

  function enableChat() {
    const chatSubmit = document.getElementById(
      "chat-submit"
    ) as HTMLInputElement;
    const chatTextarea = document.getElementById(
      "chat-textarea"
    ) as HTMLInputElement;

    // enable textarea
    chatTextarea.disabled = false;
    chatTextarea.classList.remove("disabled:cursor-not-allowed");
    chatTextarea.classList.remove("disabled:bg-gray-200");
    chatTextarea.classList.remove("disabled:text-gray-500");

    // enable submit button
    chatSubmit.disabled = false;
    chatSubmit.classList.remove("text-gray-600");
    chatSubmit.classList.add("text-blue-600");
  }

  function onSubmit(e: FormEvent, messages: messagesStr[]) {
    e.preventDefault();

    const model = document.getElementById("model") as HTMLInputElement;

    const chatTextarea = document.getElementById(
      "chat-textarea"
    ) as HTMLInputElement;
    const chatUserMessage = chatTextarea?.value;

    const modelType = model?.value;

    if (!chatUserMessage) return;

    disableChat();

    messages.push({ content: chatUserMessage, role: "user" });
    setMessages([...messages]);

    const fetchInit = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: modelType,
        msgs: messages,
        chat: chatUserMessage,
      }),
    };

    fetch("/api/chat", fetchInit)
      .then((response) => {
        console.log(response);
        return response.json();
      })
      .then((response) => {
        messages.push(response);
        setMessages([...messages]);
      })
      .catch((error) => {
        messages.push({ content: "Error: " + error, role: "AI" });
        setMessages([...messages]);
      })
      .finally(() => {
        chatTextarea.value = "";
        enableChat();
      });
  }

  // scroll to bottom using useEffect
  useEffect(() => {
    const messages = document.getElementById("messages")!;
    const chatTextarea = document.getElementById(
      "chat-textarea"
    ) as HTMLInputElement;

    if (
      messages.scrollHeight - messages.scrollTop <=
      messages.clientHeight +
        messages.children[messages.children.length - 2]?.clientHeight / 2 +
        messages.children[messages.children.length - 1]?.clientHeight
    ) {
      messages.scrollTop = messages.scrollHeight;
      chatTextarea.scrollIntoView({ behavior: "smooth" })
    }
  }, [messages]);

  return (
    <div className="lg:overflow-hidden">
      <div className="flex flex-col lg:flex-row gap-4 p-4 h-screen">
        <div className="flex flex-col lg:w-1/4 border border-gray-300 bg-white p-2">
          <h2 className="font-semibold">Configuration</h2>
          <hr className="w-full border-gray-200 my-4" />

          <form>
            <div className="">
              <label
                htmlFor="model"
                className="font-semibold text-sm font-medium"
              >
                Model
              </label>
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

        <div className="flex flex-col lg:w-3/4 mt-auto overflow-hidden lg:mt-0">
          <div
            className="flex flex-col my-1 overflow-y-auto mt-auto"
            id="messages"
          >
            {messages.map((msg, index) => (
              <div
                key={index}
                className="border border-gray-300 bg-white my-1 p-2"
              >
                <span className="font-semibold text-xs lg:text-sm">
                  {msg.role}
                </span>
                <p>{msg.content}</p>
              </div>
            ))}
          </div>

          <form
            className="flex flex-col"
            onSubmit={(e) => onSubmit(e, messages)}
          >
            <label htmlFor="chat" className="sr-only">
              Your message
            </label>
            <div className="flex items-center rounded-lg">
              <textarea
                id="chat-textarea"
                rows={2}
                className="w-full my-1 p-2.5 text-sm lg:text-base text-gray-900 bg-white border border-gray-300 focus:ring-blue-500 focus:border-blue-500 placeholder-gray-400 placeholder-gray-400 resize-none overflow-hidden"
                style={{ resize: "none" }}
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
                  <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z"></path>
                </svg>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
