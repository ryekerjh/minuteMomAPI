const mongoose = require('mongoose');
const { Model, Schema } = mongoose;

const schema = new Schema({
    name: { type: String, default: null },
    description: { type: String, default: null },
})

class Activity extends Model { }

module.exports = mongoose.model(Activity, schema, 'activity');