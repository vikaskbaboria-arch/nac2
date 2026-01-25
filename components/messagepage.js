"use client";

import React, { useState } from "react";
import { useEffect } from "react";
import { useSession } from 'next-auth/react'
import { useRouter, useSearchParams } from "next/navigation";
const MessagePage = ({conversationid}) => {

  const [message, setMessage] = useState("");
  const [messagess, setMessages] = useState([]);
    const { data: session, status } = useSession();
   
  console.log(conversationid);
  useEffect(() => {
   const fetchmessages = async () => {
    try {
      const res = await fetch(`/api/message/?chat=${conversationid}`, {
        method: 'GET',
        headers: {'content-type':'application/json'},
      });
      const data = await res.json();

      setMessages(data.message);
    } catch (err) {
      console.error(err);
    }
    
   }
   
fetchmessages();
  },[conversationid]);
  console.log(messagess);
  const messages = messagess.map((msg) => ({
    id: msg?._id,
    text: msg?.text,
    mine: msg?.sender?._id === session?.user?.id,
  }));

  const sendMessage = async () => {
    try{ 
      const res = await fetch(`/api/message/`,{method:'POST',
        headers:{'content-type':'application/json'},
        body:JSON.stringify({
          converastionId:conversationid,
          text:message,
          sender:session?.user?.id
        })
      })
      const data = await res.json();
      console.log("Message sent:",data);
      setMessage("")
    
    }
    catch(error){
      console.error("SEND MESSAGE ERROR 👉",error);
    }


  }
  const [name,setName]=useState(null)
  useEffect(()=>{
    try {
      const fetchname =async()=>{
        const res = await  fetch(`/api/conversation?conversationId=${conversationid}`)
        const data = await res.json();
        setName(data.conversation?.members)
      }
      fetchname();
    } catch (error) {
      console.log("error ", error)
    }
  },[conversationid])


const receiver = name?.find(
  (m) => m._id !== session?.user?.id
);

const receiverName = receiver?.username;

 
   
  return (
<div className="h-screen bg-gradient-to-b from-black via-zinc-900 to-black text-white flex flex-col">

  {/* HEADER */}
  <div className="
    sticky top-0 z-50
    bg-black/70 backdrop-blur-md
    px-4 py-3 sm:px-6
    border-b border-white/10
    flex items-center gap-4
  ">
    {/* Avatar */}
    <div className="
      h-10 w-10 sm:h-12 sm:w-12
      rounded-full
      bg-gradient-to-br from-purple-500 to-pink-500
      flex items-center justify-center
      font-bold text-black
    ">
      {receiverName?.[0]?.toUpperCase()}
    </div>

    {/* Name + status */}
    <div className="flex-1">
      <p className="font-semibold text-sm sm:text-base truncate">
        {receiverName}
      </p>
      <div className="flex items-center gap-1 text-xs text-green-400">
        <span className="h-2 w-2 bg-green-400 rounded-full animate-pulse" />
        online
      </div>
    </div>
  </div>

  {/* MESSAGES */}
  <div className="
    flex-1 overflow-y-auto
    px-3 sm:px-6 py-4
    space-y-3
    scrollbar-hidden
  ">
    {messages.map((msg) => (
      <div
        key={msg.id}
        className={`flex ${msg.mine ? "justify-end" : "justify-start"}`}
      >
        <div
          className={`
            max-w-[85%] sm:max-w-[70%]
            px-4 py-2.5
            text-sm sm:text-base
            rounded-2xl
            shadow-md
            transition-all
            ${msg.mine
              ? "bg-gradient-to-br from-purple-600 to-indigo-600 rounded-br-sm"
              : "bg-zinc-800 rounded-bl-sm"}
          `}
        >
          {msg.text}
        </div>
      </div>
    ))}
  </div>

  {/* INPUT */}
  <div className="
    sticky bottom-0 z-50
    bg-black/70 backdrop-blur-md
    px-3 sm:px-6 py-3
    border-t border-white/10
    flex gap-3
  ">
    <input
      value={message}
      onChange={(e) => setMessage(e.target.value)}
      placeholder="Type a message…"
      className="
        flex-1
        px-4 py-3
        rounded-full
        bg-zinc-900
        text-sm sm:text-base
        outline-none
        border border-white/10
        focus:border-purple-500/60
        focus:ring-2 focus:ring-purple-500/20
        transition
      "
    />

    <button
      onClick={sendMessage}
      className="
        px-5 sm:px-6 py-3
        rounded-full
        bg-gradient-to-br from-purple-600 to-indigo-600
        text-sm sm:text-base font-medium
        hover:opacity-90
        active:scale-95
        transition
      "
    >
      Send
    </button>
  </div>

</div>


  );
};

export default MessagePage;
