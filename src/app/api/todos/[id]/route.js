import Todo from '@/models/Todo';
import { connectDb } from '@/utils/db';
import {NextResponse} from 'next/server';
export const GET = async(request, {params})=>{
    const id = params.id;

    try {
        connectDb();
        const todo = await Todo.findById(id).populate('poster');
        return new NextResponse(JSON.stringify(todo), {status: 200});
    } catch (error) {
        return new NextResponse('Error occured fetching data', {status:500})
    }
}

export const PUT = async(request, {params})=>{
    const {id} = params;
    await connectDb();
    try {
        const updated = await Todo.findByIdAndUpdate(id, 
            {$set:await request.json()}, {new:true}
        );
        return new NextResponse('Todo updated successfully', {status:201});
    } catch (error) {
        return new NextResponse('Failed to update. Retry', {status:500})
    }
}

export const DELETE = async(request, {params})=>{
    const {id} = params;
    await connectDb();
    try {
        const updated = await Todo.findByIdAndDelete(id);
        return new NextResponse('Todo deleted successfully', {status:201});
    } catch (error) {
        return new NextResponse('Failed to delete. Retry', {status:500})
    }
}