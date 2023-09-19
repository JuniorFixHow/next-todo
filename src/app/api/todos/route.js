import Todo from "@/models/Todo";
import { connectDb } from "@/utils/db";
import {NextResponse} from 'next/server';

export const GET = async (request)=>{
    try {
        await connectDb();
        const todos = await Todo.find().populate('poster');
        return new NextResponse(JSON.stringify(todos), {status:200})
    } catch (error) {
        return new NextResponse('Error occured fetching data', {status:500})
    }
}

export const POST = async(request)=>{
    // const {title, content, completed, poster} = request.json();
    await connectDb();
    try {
        const newTodo = new Todo(await request.json());
        const saveTodo = await newTodo.save();
        return new NextResponse(JSON.stringify(saveTodo), {status:201})
    } catch (error) {
        return new NextResponse('Error occured posting data', {status:500})
    }
}