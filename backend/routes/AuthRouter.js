import express from "express"
import { login, signUp } from "../controller/AuthController.js";
const authRouter=express.Router();

authRouter.post('/signUp',signUp)
authRouter.post('/login',login)



export default authRouter