const { errorMonitor } = require('mongodb/lib/apm');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const unique = require('mongoose-unique-validator');
const userSchema = new Schema({
    name: {
      type: String,
      required: true,
      trim: true
    },
    userName:{
      type: String,
      required: true,
      trim: true,
      unique: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true
    },
    password_hash: {
      type: String,
      required: true
    },
    created_at: {
      type: Date,
      default: Date.now
    },
    last_login: {
      type: Date,
      default: Date.now
    },
    places:[ {
      type: mongoose.Types.ObjectId, required: true, ref:'Place'
    }],
    image: {
      type: String,
      required: false
    },
  });
  
  userSchema.plugin(unique);



module.exports = mongoose.model('User', userSchema);
