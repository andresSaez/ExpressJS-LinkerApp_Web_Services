import mongoose from 'mongoose';

let privateroomSchema = new mongoose.Schema({
    chat: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'chats',
        required: false
    }
});

let PrivateroomModel = mongoose.model('privateroom', privateroomSchema);

export default PrivateroomModel;