import mongoose from "mongoose";

type ConnectionObject = {
    isConnected?: number
}


const connection: ConnectionObject = {}

async function connectdb(){

    if(connection.isConnected){
        console.log("already connected to database");
        return
        
    }
        try {
            
      const db =  await mongoose.connect(process.env.MONGODB_URI || '')

      connection.isConnected = db.connections[0].readyState

      console.log("db connected sucessfully");
      

        } catch (error) {
            console.log("db connection failed");
            process.exit(1);
            
        }
      
}

export default connectdb