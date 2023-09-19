import mongoose from "mongoose";

let isconnected = false
export const connectDb = async()=>{
    mongoose.set('strictQuery', true);
    if(isconnected){
        console.log('Mongo already connected');
        return
    }
    try {
        await mongoose.connect(process.env.MONGO,{
            useNewUrlParser:true,
            useUnifiedTopology:true,
        });
        isconnected = true;
        console.log('mongo connected successfully');
    } catch (error) {
        throw new Error('DB failed')
    }
}