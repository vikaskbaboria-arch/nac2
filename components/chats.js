
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
<div className="divide-y divide-white/5 ">
  {conversations?.map((conversation) => {
    const receiver = conversation.members.find(
      (m) => m._id !== session?.user?.id
    );
       const time = new Date(conversation.lastMessage?.createdAt).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });

    return (
      <div
        key={conversation._id}
        onClick={() => handleClick(conversation._id)}
        className="
          group flex items-center gap-4
          px-4 py-3
          bg-slate-950
          cursor-pointer
          transition
        
          active:bg-black/90
        "
      >
        {/* Avatar */}
        <div className="h-11 w-11 flex-shrink-0 rounded-full bg-zinc-700 flex items-center justify-center text-sm font-semibold text-white">
          {receiver?.username?.[0]?.toUpperCase() || "?"}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <p className="text-sm sm:text-base font-medium text-white truncate">
              {receiver?.username || "Unknown user"}
            </p>

            {/* Time (optional later) */}
            <span className="text-[11px] text-zinc-100 ml-2 whitespace-nowrap">
         {time}
            </span>
          </div>

          <p className="text-sm text-zinc-400 truncate mt-0.5">
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