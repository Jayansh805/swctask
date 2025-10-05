import { Schema } from "mongoose";
import mongoose from "mongoose";

const wishSchema = new Schema({
    creator: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    item:{
        type: Schema.Types.ObjectId,
        ref: 'SItems',
        required: true
    },
    createdAt: { 
        type: Date, 
        default: Date.now 
    }
}, { timestamps: true });

export default mongoose.model('Wish', wishSchema);