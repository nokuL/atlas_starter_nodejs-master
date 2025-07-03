const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const favoriteSchema = new Schema({
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    place: {
      type: Schema.Types.ObjectId,
      ref: 'Place',
      required: true
    },
    favorited_at: {
      type: Date,
      default: Date.now
    },
    notes: {
      type: String
    }
  });
  favoriteSchema.index({ user: 1, place: 1 }, { unique: true });
  module.exports = mongoose.model('Favourite', favoriteSchema)
