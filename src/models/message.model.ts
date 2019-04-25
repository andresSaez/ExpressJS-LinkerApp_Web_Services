import mongoose from 'mongoose';

let messageSchema = new mongoose.Schema({
    creator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
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
        required: true
    },
    date: {
        type: Date,
        required: true
    }
});

let MessageModel = mongoose.model('user', messageSchema);

export default MessageModel;