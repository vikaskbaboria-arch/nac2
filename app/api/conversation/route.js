
import Conversation from "@/models/conversation";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import Message from "@/models/message";
import connectDB from "@/db";
import User from "@/models/user";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
export const POST = async (req) => {
    try {
         await connectDB();
         const session = await getServerSession(authOptions);
            if (!session || !session.user || !session.user.email) {
              return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
            }
        

    const sender = await User.findOne({ email: session.user.email });
                
    const body = await req.json();

    const { member2Id}
        = body || {};
    if ( !member2Id) {
        return NextResponse.json({ error: "Invalid data" }, { status: 400 });   }
        let conversation = await Conversation.findOne({
  members: { $all: [sender._id, member2Id] }
})

    if(!conversation){
        conversation = await Conversation.create({members: [sender._id,member2Id]});
    }
    return NextResponse.json({ conversation }, { status: 200 });
    }
    catch (error) {
      console.log("error",error)
        return NextResponse.json({error:"Database connection failed"},{status:500});
    }
}


export const GET = async (req) => {
    try {
          await connectDB();

    const { searchParams } = new URL(req.url);
    const conversationId = searchParams.get("conversationId");

    // 🔹 CASE 1: Single conversation by ID
    if (conversationId) {
      const conversation = await Conversation.findById(conversationId)
        .populate("members", "username email")
.populate({
  path: "lastMessage",
  select: "text sender createdAt",
})

  .sort({ updatedAt: -1 })
  .exec();


      if (!conversation) {
        return NextResponse.json(
          { error: "Conversation not found" },
          { status: 404 }
        );
      }

      return NextResponse.json({ conversation }, { status: 200 });
    }



        const session = await getServerSession(authOptions);
        if (!session || !session.user || !session.user.email) {
          return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
        }
        await connectDB();
        const user = await User.findOne({ email: session.user.email });
        const conversations = await Conversation.find({ members: user._id }).populate('members', 'username email')  .populate({
    path: "lastMessage",
    select: "text sender createdAt",
  }).exec();
        return NextResponse.json({ conversations }, { status: 200 });
    } catch (error) {
        return NextResponse.json({error:"Database connection failed"},{status:500});
    }   }


