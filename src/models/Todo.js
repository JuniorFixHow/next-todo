import { Schema, model, models } from "mongoose"
const todoSchema = new Schema({
    title:{
        type:String,
        required:true
    },
    content:{
        type:String,
        required:true,
    },
    completed:{
        type:Boolean,
        default:false
    },
    poster:{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
}, {timestamps:true});

const Todo = models.Todo || model('Todo', todoSchema)
export default Todo;