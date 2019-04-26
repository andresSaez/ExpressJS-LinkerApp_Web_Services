import mongoose from 'mongoose';

let settingsSchema = new mongoose.Schema({
    // userid: {
    //     type: mongoose.Schema.Types.ObjectId,
    //     required: true
    // },
    privacity: {
        blockedusers: {
            type: [mongoose.Schema.Types.ObjectId],
            required: false,
            default: []
        },
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
            exceptions: {
                type: [mongoose.Schema.Types.ObjectId],
                ref: 'privaterooms',
                required: false,
                default: []
            }
        },
        rooms: {
            active: {
                type: Boolean,
                required: false,
                default: true
            },
            exceptions: {
                type: [mongoose.Schema.Types.ObjectId],
                ref: 'rooms',
                required: false,
                default: []
            }
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

let SettingsModel = mongoose.model('setting', settingsSchema);

export default SettingsModel;