import mongoose from 'mongoose';

let userSchema = new mongoose.Schema({
    nick: {
        type: String,
        trim: true,
        required: false
    },
    name: {
        type: String,
        required: true,
        minlength: 1,
        trim: true
    },
    email: {
        type: String,
        trim: true,
        match: /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/,
        required: true
    },
    password: {
        type: String,
        trim: true,
        required: false
    },
    avatar: {
        type: String,
        required: false
    },
    biography: {
        type: String,
        required: false,
        maxlength: 100
    },
    lat: {
        type: Number,
        required: false
    },
    lng: {
        type: Number,
        required: false
    },
    interests: {
        type: [String],
        required: false
    },
    lastconnection: {
        type: Date,
        required: false
    },
    onesignalid:{
        type: String,
        required: false,
        trim: true
    },
    contacts: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'users',
        required: false
    },
    rooms: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'rooms',
        required: false
    },
    privaterooms: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'privaterooms',
        required: false
    },
    settings: {
       type: mongoose.Schema.Types.ObjectId,
       ref: 'settings',
       required: false
    }
});

let UserModel = mongoose.model('user', userSchema);

export default UserModel;