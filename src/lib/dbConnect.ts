import mongoose from "mongoose";


type ConnectionObject={
    isConnected?:number
}

const connection:ConnectionObject={}

async function connectiondb():Promise<void> {
    if (connection.isConnected) {
        console.log("Already connected");
        return 
    }
    try {
        await mongoose.connect(process.env.MONGO_URL)
    } catch (error) {
        
    }
    
}