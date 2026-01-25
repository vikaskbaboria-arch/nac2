
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
<div >


  {conversations?.map((conversation) => {
  const receiver = conversation.members.find(
    (m) => m._id !== session?.user?.id
  );

  return (
  <div
  key={conversation._id}
  onClick={() => handleClick(conversation._id)}
  className="
    group flex items-center gap-4
    cursor-pointer
    rounded-2xl
    border border-white/10
    bg-white/5 backdrop-blur-md
    p-4
   text-white
  "
>
  {/* Avatar */}
  <div className="
    h-12 w-12 sm:h-14 sm:w-14
    rounded-full
    bg-gradient-to-br from-purple-500 to-pink-500
    flex items-center justify-center
    text-white font-bold text-lg
    shrink-0
  ">
    {receiver?.username?.[0]?.toUpperCase()}
  </div>

  {/* Content */}
  <div className="flex-1 overflow-hidden">
    <div className="flex items-center justify-between">
      <h3 className="
        text-white font-semibold
        truncate
        text-sm sm:text-base
      ">
        {receiver?.username || "Unknown user"}
      </h3>

      <span className="text-xs text-white hidden sm:block">
        {conversation?.lastMessage?.createdAt &&
          new Date(conversation.lastMessage.createdAt).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
      </span>
    </div>

    <p className="
      text-white/70
      text-xs sm:text-sm
      truncate mt-1
      group-hover:text-white
      transition-colors
    ">
      {conversation?.lastMessage?.text || "No messages yet"}
    </p>
  </div>
</div>

  );
})}

</div>
  )
}

export default Chats