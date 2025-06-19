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
      const db=  await mongoose.connect(process.env.MONGO_URI || "",{});
    
     
      
      connection.isConnected= db.connections[0].
    readyState
    console.log("DB connected sucessfully");
    
    } catch (error) {
        console.log("DB connection failed ",error);
        process.exit(1);
        
    }
    
}