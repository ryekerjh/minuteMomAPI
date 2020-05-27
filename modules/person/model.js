const mongoose = require('mongoose');
const { Model, Schema } = mongoose;
const genderEnum = ["male", "female"];

const schema = new Schema({
    age: { type: Number, default: 1 },
    gender: {
        type: String,
        enum: genderEnum,
        default: 'male'
    },
    interests: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Activity'
    }]
})

class Person extends Model { }

module.exports = mongoose.model(Person, schema, 'person');