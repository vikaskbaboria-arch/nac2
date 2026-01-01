import mongoose from "mongoose";

let isConnected = false; // Track connection status

const connectDB = async () => {
    if (isConnected) {
        console.log("MongoDB is already connected");
        return;
    }

    try {
        const connect = await mongoose.connect("mongodb+srv://youtubeuser:vikas123@cluster0.g9wasdu.mongodb.net/nac");
        isConnected = true;
        console.log(`MongoDB connected: ${connect.connection.host}`);
    } catch (error) {
        console.error(error.message);
        process.exit(1);
    }
};

export default connectDB;
