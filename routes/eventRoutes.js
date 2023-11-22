const express = require('express');
const myEventController = require('../controllers/eventController');
const {fileUpload} = require('../middleware/fileUpload');
const {validateId} = require('../middleware/validator');
const {isLoggedIn, isAuthor} = require('../middleware/auth');

const router = express.Router();

// get /events: send all events
router.get('/', myEventController.index);

// get /events/new: send form for creating a new event
router.get('/newEvent', isLoggedIn, myEventController.new);

// post /events: create a new event
router.post('/', isLoggedIn, fileUpload, myEventController.create);

// get /events/:id: send event details of event with given id
router.get('/:id', validateId, myEventController.show);

// get /events/:id/edit: send form for editing event with given id
router.get('/:id/edit', isLoggedIn, validateId, isAuthor, myEventController.edit);

// put /events/:id: update event with given id
router.put('/:id', isLoggedIn, validateId, isAuthor, fileUpload, myEventController.update);

// delete /events/:id: delete event with given id
router.delete('/:id', isLoggedIn, validateId, isAuthor, myEventController.delete);

module.exports = router;