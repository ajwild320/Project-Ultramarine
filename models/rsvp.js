const mongoose = require('mongoose');
const User = require('./user');
const Event = require('./event');

// RSVP Model
const rsvpSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  event: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event',
    required: true,
  },
  status: {
    type: String,
    enum: ['YES', 'NO', 'MAYBE'],
    required: true,
  },
});

const RSVP = mongoose.model('RSVP', rsvpSchema);
module.exports = RSVP;
