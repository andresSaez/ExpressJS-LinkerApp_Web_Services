import mongoose from 'mongoose';

let chatSchema = new mongoose.Schema({
    messages: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'messages',
        required: false
    }
});

let ChatModel = mongoose.model('chat', chatSchema);

export default ChatModel;