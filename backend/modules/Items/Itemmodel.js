import { Schema } from "mongoose";
import mongoose from "mongoose";

const itemSchema = new Schema({
    creator: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    itemname: { 
        type: String, 
        required: true  
    },
    itemprice: { 
        type: Number,
        required: true
    },
    itemcategory: { 
        type: String,
        required: true
    },
    itemimage: {
        type: String,
        default: ''
    },
    itemdescription: {  
        type: String,
        required: true
    },
    createdAt: { 
        type: Date, 
        default: Date.now 
    }
}, { timestamps: true });

export default mongoose.model('SItems', itemSchema);