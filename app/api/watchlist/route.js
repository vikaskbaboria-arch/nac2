import connectDB from "@/db";
import Watch from "@/models/watchlist";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

import Movie from "@/models/movie.models";
import User from "@/models/user";

import user from "@/models/user";

const POST =async(req)=>{
    try {
        await connectDB();
        const session =await getServerSession(authOptions);
         if (!session || !session.user || !session.user.email) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }
    const body =req.json();
    const {movieid}=body ||{}
    const mid =movieid
    const currentUser = await User.findOne({email:session.user.email})
    if(!currentUser){
      return NextResponse.json({error:"User does not exists"},{status: 404});
    }
    let currentMovie =await Movie.findOne({movieid:mid});
    if(!currentMovie
    ){
        currentMovie =await Movie.create({movieid:mid})
    }
    const existWatch = await Watch.findOne({user:currentUser._id,movie:currentMovie._id});
if(existWatch){
    return NextResponse.json({error:"Movie alredy exits in your watch list"},{status:400})
};
const watchList = await Watch.create({
    user: currentUser._id,
    movie: currentUser._id
});
return NextResponse.json(watchList,{status:201})
    } catch (error) {
        console.log(error);
        return NextResponse.json({error:"Server error"},{status:500})
    }
};
export {POST}