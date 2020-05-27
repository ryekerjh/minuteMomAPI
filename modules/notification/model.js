const mongoose = require('mongoose');
const { Model, Schema } = mongoose;
const frequencyEnum = ["hourly", "daily", "monthly", "bi-weekly"];

const schema = new Schema({
    frequency: {
        type: String,
        enum: frequencyEnum,
        default: 'daily'
    },
    activity: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Activity'
    }]
})

class Notification extends Model { }

module.exports = mongoose.model(Notification, schema, 'notification');