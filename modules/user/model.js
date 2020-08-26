const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
//   role: { type: String, enum: ['superadmin','admin', 'cityUser', 'user', 'propertyManager'], default: 'user'},
//   email: {type: String, default: ''},
//   people: [{type: mongoose.Schema.Types.ObjectId, ref:'Person'}],
//   password: {type: String, select: false},
//   createdAt: {type: Date, default: Date.now},
//   updatedAt: {type: Date, default: Date.now},
});
//Stuff
let User = mongoose.model('User', UserSchema);
module.exports = User;
