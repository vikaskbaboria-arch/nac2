
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
      className="bg-purple-800 text-white cursor-pointer border border-black m-2 p-3 rounded"
    >
      <h3 className="text-white font-semibold">
        {receiver?.username || "Unknown user"}
      </h3>
      <div>
        {conversations?.lastMessage?.text|| "No messages yet."}
      </div>
    </div>
  );
})}

</div>
  )
}

export default Chats