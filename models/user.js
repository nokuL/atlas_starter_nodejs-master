const { errorMonitor } = require('mongodb/lib/apm');
const mongoose = require('mongoose');
const unique = require('mongoose-unique-validator');
const userSchema = new Schema({
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true
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
    }]
  });
  
  userSchema.plugin(unique);



module.exports = mongoose.model('User', userSchema);
