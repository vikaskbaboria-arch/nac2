import connectDB from "@/db";
import User from "@/models/user";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "../auth/[...nextauth]/options";
export const POST = async(req,res)=>{
try{
            await connectDB();
            const session = await getServerSession(authOptions)
            if(!session|| !session.user || !session.user.email){
                return NextResponse({error:"not Authenticated"},{status:404});
            }
            const body = req.json();
            const favgenre = body

            const USER =  await User.findOne({email:session.user.email})
            if(!USER){
                return NextResponse({error:"user not found in database"},{status:401})}

            
            const update = await User.findByIdAndUpdate(USER._id,{fav_genres:favgenre},{new:true});

            return NextResponse.json({ update }, { status: 200 });
}
catch(e){
     console.log("Error",e);
     return NextResponse.json({error:"Database connection failed "},{status:500})
}

}