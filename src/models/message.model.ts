import mongoose from 'mongoose';

let messageSchema = new mongoose.Schema({
    creator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    content: {
        type: String,
        required: false
    },
    image: {
        type: String,
        required: false
    },
    checked: {
        type: Boolean,
        required: true,
        default: false
    },
    date: {
        type: Date,
        required: true,
        default: new Date()
    }
});

let MessageModel = mongoose.model('message', messageSchema);

export default MessageModel;