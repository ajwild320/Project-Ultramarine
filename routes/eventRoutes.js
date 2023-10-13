const express = require('express');
const router = express.Router();
const myEventController = require('../controllers/eventController');
const {fileUpload} = require('../middleware/fileUpload');

// get /events: send all events
router.get('/', myEventController.index);

// get /events/new: send form for creating a new event
router.get('/newEvent', myEventController.new);

// post /events: create a new event
router.post('/', fileUpload, myEventController.create);

// get /events/:id: send event details of event with given id
router.get('/:id', myEventController.show);

// get /events/:id/edit: send form for editing event with given id
router.get('/:id/edit', myEventController.edit);

// put /events/:id: update event with given id
router.put('/:id', fileUpload, myEventController.update);

// delete /events/:id: delete event with given id
router.delete('/:id', myEventController.delete);

module.exports = router;