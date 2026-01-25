
"use client"
import React from 'react'
import { useSession } from 'next-auth/react'
import { useState } from 'react';
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from 'react';
const Chats = () => {
 const { data: session, status } = useSession();
const router = useRouter();

const [name,setName]=useState(null)
   const [conversations, setConversations] = useState(null);
    useEffect(() => {
    const fetchConversations = async () => {
      try {
        const res = await fetch('/api/conversation', {
          method: 'GET',
          headers: {'content-type':'application/json'},
        });
        const data = await res.json();
        setConversations(data.conversations);

      } catch (err) {
        console.error(err);
      }}
fetchConversations();  
  },[]);

console.log("conversations",conversations)
const handleClick = (id) => {
    router.push(`/message/${id}`);
};







  return (
<div className="h-screen flex flex-col bg-[#0b0b0c] text-white">

  {/* HEADER */}
  <div className="sticky top-0 z-40 px-4 sm:px-6 py-3 border-b border-white/5 bg-[#0b0b0c]/90 backdrop-blur">
    <div className="flex items-center gap-3">
      <div className="h-10 w-10 rounded-full bg-zinc-700 flex items-center justify-center text-sm font-medium">
        {receiverName?.[0]?.toUpperCase()}
      </div>

      <div className="leading-tight">
        <p className="text-sm sm:text-base font-medium">
          {receiverName}
        </p>
        <p className="text-xs text-zinc-400">online</p>
      </div>
    </div>
  </div>

  {/* MESSAGES */}
  <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-6 space-y-6">

    {messages.map((msg, index) => {
      const time = new Date(msg.createdAt).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });

      return (
        <div
          key={msg._id || index}
          className={`flex ${msg.mine ? "justify-end" : "justify-start"}`}
        >
          <div className="max-w-[85%] sm:max-w-[70%]">
            
            {/* Message bubble */}
            <div
              className={`px-4 py-2.5 rounded-lg text-sm sm:text-base leading-relaxed
                ${msg.mine
                  ? "bg-zinc-800 text-white"
                  : "bg-zinc-900 text-zinc-100"}
              `}
            >
              {msg.text}
            </div>

            {/* Timestamp */}
            <div
              className={`mt-1 text-[11px] text-zinc-500 ${
                msg.mine ? "text-right" : "text-left"
              }`}
            >
              {time}
            </div>
          </div>
        </div>
      );
    })}
  </div>

  {/* INPUT */}
  <div className="sticky bottom-0 z-40 px-4 sm:px-6 py-3 border-t border-white/5 bg-[#0b0b0c]/90 backdrop-blur">
    <div className="flex items-center gap-3">

      <input
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Message…"
        className="flex-1 bg-zinc-900 px-4 py-2.5 rounded-md text-sm sm:text-base outline-none border border-white/5 focus:border-zinc-600 transition"
      />

      <button
        onClick={sendMessage}
        className="px-4 py-2.5 rounded-md bg-white text-black text-sm font-medium hover:opacity-90 active:scale-[0.97] transition"
      >
        Send
      </button>

    </div>
  </div>

</div>


  )
}

export default Chats