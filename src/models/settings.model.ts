import mongoose from 'mongoose';

let settingsSchema = new mongoose.Schema({
    // userid: {
    //     type: mongoose.Schema.Types.ObjectId,
    //     required: true
    // },
    privacity: {
        blockedusers: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'user',
            required: false
        }],
        lastconnection: {
            type: String,
            required: false,
            trim: true,
            default: 'ALL'
        },
        profilephoto: {
            type: String,
            required: false,
            trim: true,
            default: 'ALL'
        },
        profiledata: {
            showname: {
                type: Boolean,
                required: false,
                default: true
            },
            showemail: {
                type: Boolean,
                required: false,
                default: true
            },
            show: {
                type: String,
                required: false,
                trim: true,
                default: 'ALL'
            }
        }
    },
    notifications: {
        private: {
            active: {
                type: Boolean,
                required: false,
                default: true
            },
            exceptions: [{
                type: mongoose.Schema.Types.ObjectId,
                ref: 'privateroom',
                required: false
            }]
        },
        rooms: {
            active: {
                type: Boolean,
                required: false,
                default: true
            },
            exceptions: [{
                type: mongoose.Schema.Types.ObjectId,
                ref: 'room',
                required: false
            }]
        }
    },
    language: {
        type: String,
        maxlength: 3,
        trim: true,
        required: false,
        default: 'ENG'
    }
});

let SettingsModel = mongoose.model('settings', settingsSchema);

export default SettingsModel;