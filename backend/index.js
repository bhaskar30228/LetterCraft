import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDb from './config/db.js';
import authRouter from './routes/AuthRouter.js';
dotenv.config();   
connectDb()
const app=express()
app.use(express.json())
app.use(cors());
app.get('/',(req,res)=>{
    res.send("Hello")
})

app.use('/auth',authRouter)

app.listen(process.env.PORT,()=>{
    console.log(`Server is running on http://localhost:${process.env.PORT}`);
})