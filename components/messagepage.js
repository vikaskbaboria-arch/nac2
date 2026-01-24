"use client";

import React, { useState } from "react";
import { useEffect } from "react";
import { useSession } from 'next-auth/react'
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
<div className="h-screen bg-black text-white flex flex-col">
  
  {/* HEADER (STICKY TOP) */}
  <div className="sticky top-0 z-50 bg-black p-4 border-b border-white/10 flex items-center gap-3">
    <div className="h-10 w-10 rounded-full bg-gray-700" />
    <div>
      <p className="font-semibold">{receiverName}</p>
      <p className="text-xs text-green-400">online</p>
    </div>
  </div>

  {/* MESSAGES (SCROLLABLE AREA) */}
  <div className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-hidden">
    {messages.map((msg) => (
      <div
        key={msg.id}
        className={`flex ${msg.mine ? "justify-end" : "justify-start"}`}
      >
        <div
          className={`max-w-[70%] px-4 py-2 rounded-2xl text-sm ${
            msg.mine
              ? "bg-purple-600 rounded-br-sm"
              : "bg-gray-800 rounded-bl-sm"
          }`}
        >
          {msg.text}
        </div>
      </div>
    ))}
  </div>

  {/* INPUT (STICKY BOTTOM) */}
  <div className="sticky bottom-0 z-50 bg-black p-4 border-t border-white/10 flex gap-3">
    <input
      value={message}
      onChange={(e) => setMessage(e.target.value)}
      placeholder="Type a message"
      className="flex-1 px-4 py-3 rounded-full bg-gray-900 outline-none"
    />
    <button
      onClick={sendMessage}
      className="px-6 py-3 rounded-full bg-purple-600 hover:bg-purple-700"
    >
      Send
    </button>
  </div>

</div>

  );
};

export default MessagePage;
