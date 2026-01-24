import connectDB from "@/db";
import Movie from "@/models/movie.models";
import User from "@/models/user";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import Interested from "@/models/intested";

export const POST = async(req)=>{
    try {
        await connectDB();
        const session = await getServerSession(authOptions);
    if (!session || !session.user || !session.user.email) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }
    const body = req.json()
    const {movieID} = body ||{}
    const mid = movieID
    const currentUser =await User.findOne({email:session.user.email})
    if(!currentUser){
        return NextResponse.json({ error: "User does not exist" }, { status: 404 });
    }
    const currentMovie = await Movie.findOne({movieid:mid})
    if(!currentMovie){
      const movie= await  Movie.create({movieid:mid})
    }
    const existingIntrested  = await Interested.findOne({user:currentUser._id,movie: currentMovie._id })
    if(existingIntrested){
        return NextResponse.json({ error: "Already in watchlist" }, { status: 403 });
            
    }
      const intrest = await Interested.create({
          user: currentUser._id,
          movie: currentMovie._id,
        });
    
        return NextResponse.json({ intrest }, { status: 201 });
    } catch (error) {
        
    }
}
export const GET = async () => {
  try {
    await connectDB();

    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "User not authenticated" }, { status: 401 });
    }

    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const interested = await Interested.find({ user: user._id })
      .populate({ path: "movie", select: "movieid" })
      .lean();

    return NextResponse.json({ interested }, { status: 200 });
  } catch (err) {
    console.error("GET watchlist error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}