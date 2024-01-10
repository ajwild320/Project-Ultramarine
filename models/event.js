const mongoose = require('mongoose');
const Schema = require('mongoose').Schema;
const RSVP = require('./rsvp');
const validator = require('validator');

// Defining the Event schema
const eventSchema = new mongoose.Schema({
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: ['Warhammer 40K', 'Warhammer Fantasy', 'Meet and Chill', 'Painting Session', 'Warhammer 30K', 'Other'],
  },
  title: {
    type: String,
    required: [true, 'Title is required'],
  },
  hostName: {
    type: String,
    required: [true, 'Host is required'],
  },
  location: {
    type: String,
    required: [true, 'Location is required'],
  },
  startDateTime: {
    type: Date,
    required: [true, 'Start time is required'],
    validate: {
      validator: function (value) {
        // Convert Date object to string before validation
        return validator.isISO8601(value.toISOString());
      },
      message: 'Invalid startDateTime format',
    },
  },
  endDateTime: {
    type: Date,
    required: [true, 'End time is required'],
    validate: [
      {
        validator: function (value) {
          // Convert Date object to string before validation
          return validator.isISO8601(value.toISOString());
        },
        message: 'Invalid endDateTime format',
      },
    ],
  },
  details: {
    type: String,
    required: [true, 'Details are required'],
    minlength: [10, 'Details must be at least 10 characters long'],
  },
  image: {
    type: String,
    required: [true, 'Image is required'],
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Author is required'],
  },
  rsvps: [RSVP.schema],
}, { timestamps: true });

exports.obtainCategories = async () => {
  try {
    return await events.distinct('category');
  } catch (error) {
    console.error("Error obtaining categories:", error);
    return [];
  }
};

module.exports = {
  Event: mongoose.model('Event', eventSchema, 'events')
};