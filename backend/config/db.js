import mongoose from "mongoose";

const connectDb=async()=>{
    try{
        await mongoose.connect(process.env.CONNECTION_URI)
        console.log("Connected");
    }catch(err){
        console.log("Connection err",err.message);
        
    }
}

export default connectDb