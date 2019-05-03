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
        required: false,
        default: 'public/img/users/default-profile.jpg'
    },
    biography: {
        type: String,
        required: false,
        maxlength: 100,
        default: ''
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
        required: false,
        default: []
    },
    lastconnection: {
        type: Date,
        required: false,
        default: new Date()
    },
    onesignalid:{
        type: String,
        required: false,
        trim: true
    },
    contacts: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: false
    }],
    rooms: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'room',
        required: false
    }],
    privaterooms: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'privateroom',
        required: false
    }],
    settings: {
       type: mongoose.Schema.Types.ObjectId,
       ref: 'settings',
       required: false
    }
});

let UserModel = mongoose.model('user', userSchema);

export default UserModel;