import mongoose,{Schema} from "mongoose";
import User from "@/models/user";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { NextResponse } from "next/server";
import Space from "@/models/space.model";
import connectDB from "@/db";
import Movie from "@/models/movie.models";
     const validTypes = [
            
            "news",
            "trailer",
            "discussion"
        ];

export async function POST ( req) {
    try{

    const { spaceType, movieId, movieTitle, content, img, video, backdrop, title } = await req.json();
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
        return NextResponse.json({ message: "User not authenticated" }, { status: 401 });
    }
    const postedBy = session?.user?.id;
    if(!postedBy || !spaceType || !content || !movieId || !movieTitle){
        return NextResponse.json({message:"Missing required fields"}, {status: 400});
    }
    if(spaceType === "trailer" && !video){
        return NextResponse.json({message:"Missing video URL for trailer"}, {status: 400});
    }
      

    if (!validTypes.includes(spaceType)) {
        return NextResponse.json({ message: "Invalid space type" }, {status: 400});
    }

    await connectDB();
    let movie = await Movie.findOne({
        $or: [
            { movieId: String(movieId) },
            { movieid: Number(movieId) || -1 }
        ]
    });
    if(!movie){
        movie = await Movie.create({
            movieId: String(movieId),
            movieid: Number(movieId) || undefined,
            media_type: "movie",
            moviePoster: img,
            movieTitle: movieTitle
        });
    }
    const newSpace = new Space({
        postedBy,
        spaceType,
        title: title || null,
        movieId: movie._id,
        content,
        img: img || null,
        backdrop: backdrop || null,
        video: video || null
    })
    await newSpace.save();
    return NextResponse.json({ message: "Space created successfully", space: newSpace }, { status: 200 });
}
catch(err){
    console.error("Error creating space:", err);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
}
}
export async function GET(req) {
    try {
        const { searchParams } = new URL(req.url);

        const type = searchParams.get("type");
        const filter = {};
        if (type && type !== "all") {
            filter.spaceType = type;
        }
        await connectDB();
        const spaces = await Space.find(filter)
            .populate("postedBy", "username email name profilepic image")
            .populate("movieId", "movieTitle moviePoster movieid movieId media_type")
            .sort({ createdAt: -1 });

        return NextResponse.json({ message: "Spaces fetched successfully", spaces });
    }
    catch (err) {
        console.error("Error fetching spaces:", err);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}