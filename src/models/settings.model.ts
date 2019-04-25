import mongoose from 'mongoose';

let settingsSchema = new mongoose.Schema({
    userid: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    privacity: {
        blockedusers: {
            type: [mongoose.Schema.Types.ObjectId],
            required: false
        },
        lastconnection: {
            type: String,
            required: false,
            trim: true
        },
        profilephoto: {
            type: String,
            required: false,
            trim: true
        },
        profiledata: {
            showname: {
                type: Boolean,
                required: false
            },
            showemail: {
                type: Boolean,
                required: false
            },
            show: {
                type: String,
                required: false,
                trim: true
            }
        }
    },
    notifications: {
        private: {
            active: {
                type: Boolean,
                required: false
            },
            exceptions: {
                type: [mongoose.Schema.Types.ObjectId],
                ref: 'privaterooms',
                required: false
            }
        },
        rooms: {
            active: {
                type: Boolean,
                required: false
            },
            exceptions: {
                type: [mongoose.Schema.Types.ObjectId],
                ref: 'rooms',
                required: false
            }
        }
    },
    language: {
        type: String,
        maxlength: 3,
        trim: true,
        required: false
    }
});

let SettingsModel = mongoose.model('setting', settingsSchema);

export default SettingsModel;