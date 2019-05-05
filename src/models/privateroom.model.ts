import mongoose from 'mongoose';

let privateroomSchema = new mongoose.Schema({
    chat: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'chat',
        required: false
    },
    members: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: false
    }]
});

let PrivateroomModel = mongoose.model('privateroom', privateroomSchema);

export default PrivateroomModel;