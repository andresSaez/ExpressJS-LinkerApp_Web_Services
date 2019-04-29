import mongoose from 'mongoose';

let roomSchema = new mongoose.Schema({
    creator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: false
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
        required: false,
        default: 'public/img/users/default-image.jpg'
    },
    hastags: {
        type: [String],
        required: false,
        default: []
    },
    date: {
        type: Date,
        required: false,
        default: new Date()
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
        ref: 'chat',
        required: false
    },
    members: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'user',
        required: false,
        default: []
    }
});

let RoomModel = mongoose.model('room', roomSchema);

export default RoomModel;