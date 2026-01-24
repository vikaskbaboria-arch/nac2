import User from "@/models/user";
import Conversation from "@/models/conversation";
import connectDB from "@/db";
import { NextResponse } from "next/server";
import Message from "@/models/message";



export  const POST = async (req) => {
  try{ await connectDB();
     const body = await  req.json();
     const {converastionId,text,sender}= body || {};
        if(!converastionId || !text || !sender){   
            return NextResponse.json({error:"Invalid data"},{status:400});
        }
        const conversation = await Conversation.findOne({_id:converastionId });
        if(!conversation){
            return NextResponse.json({error:"Conversation not found"},{status:401});
        }
        const newMessage = await Message.create({
            conversation: converastionId,
            text:text,
            sender:sender
        })
     await Conversation.findByIdAndUpdate(
      converastionId,
      {
        $set: {
          lastMessage: newMessage._id,
        },
      },
      { new: true }
    );
if(!lastMessage){
    return NextResponse({status:400},{error:"lastmessage"})
}

        return NextResponse.json({message:newMessage},{status:200});
  }
 catch (error) {
  console.error("MESSAGE CREATE ERROR 👉", error);
  return NextResponse.json(
    { error: error.message },
    { status: 500 }
  );
}



}


export const GET = async(req)=>{
    try {
       await connectDB();
       const url = new URL(req.url);
     const conversationId = url.searchParams.get("chat") || url.searchParams.get("chat");
     if(!conversationId){
        return NextResponse.json({error:"not a valid conversationid"},{status:400})
     }
     const message=  await Message.find({conversation:conversationId}).
   populate("sender", "username email")
   .sort({ createdAt: 1 })
  .exec();
     console.log("Messages fetched:",message);
     if(!message){
        return NextResponse({error:"no  message found"},{status:401})
     }
    
        return NextResponse.json({message},{status:200})
    } catch (error) {
        console.error("MESSAGE GET ERROR 👉", error);
    }
}