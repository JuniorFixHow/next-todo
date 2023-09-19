import User from "@/models/User";
import { connectDb } from "@/utils/db";
import { NextResponse } from "next/server";
import bcrypt from 'bcryptjs';

export const POST = async(request)=>{
    const {email, username, password} = await request.json();
    await connectDb();
    try {
        const hash = await bcrypt.hash(password, 10);
        const newUser = new User({
            email, username, password:hash
        })
        const savedUser = await newUser.save();
        return new NextResponse(JSON.stringify(savedUser), {status:201})
    } catch (error) {
        return new NextResponse(error.message, {status:500})
    }
}