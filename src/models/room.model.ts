import mongoose from 'mongoose';

let roomSchema = new mongoose.Schema({
    creator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: true
    },
    name: {
        type: String,
        trim: true,
        required: true
    },
    description: {
        type: String,
        required: false
    },
    image: {
        type: String,
        required: false
    },
    hastags: {
        type: [String],
        required: false
    },
    date: {
        type: Date,
        required: false
    },
    lat: {
        type: Number,
        required: true
    },
    lng: {
        type: Number,
        required: true
    },
    chat: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'chats',
        required: false
    },
    members: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'users',
        required: false
    }
});

let RoomModel = mongoose.model('room', roomSchema);

export default RoomModel;