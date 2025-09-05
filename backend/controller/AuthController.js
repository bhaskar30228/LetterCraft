import User from "../models/UsersModel.js"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
const generationtoken=(userId)=>{
    return jwt.sign({id:userId},process.env.SECRET_KEY,{expiresIn:'7d'})
}
export const signUp=async(req,res)=>{
    try{

        const {username,email,password}=req.body
        if(!username || !email || !password){
            return res.status(400).json({message:"All feilds are required"})
        }
        const existingUser=await User.findOne({email})
        if(existingUser){
            return res.status(400).json({error:"User already exists || You already have an account please login"})
        }
        const hashedPass=await bcrypt.hash(password,10);
        const newUser=await User.create({
            username,
            email,
            password:hashedPass
        })
        return res.status(201).json(
            {
                user:newUser,
                token:generationtoken(newUser._id)
            }
        )
    }catch(err){
        console.log("SignUp error:", err);
        return res.status(500).json({ error: "Server error" });
    }
}



export const login=async(req,res)=>{
    try{
        const{email,password}=req.body
        if(!email || !password){
            return res.status(400).json({message:"All fields are required"})
        }
        const user=await User.findOne({email})
        if(!user){
            return res.status(400).json({error:"User does not exist || Please regiter"})
        }
        const isMatch=await bcrypt.compare(password,user.password)
    
        const token=jwt.sign({
            id:user._id,
            email:user.email
        },process.env.SECRET_KEY,
         {expiresIn:"2h"}
    )
        return res.status(200).json({token,user:user})
    }catch(error){
        console.error("Login error:", error);
        return res.status(500).json({ error: "Server error" });
    }

}