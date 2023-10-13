const model = require('../models/event');
const {fileUpload} = require('../middleware/fileUpload');

// get /events: send all events
exports.index = (req, res) => {
    let events = model.find();
    let categories = model.obtainCategories();
    res.render('./events/events', { 
        events: events, 
        categories: categories
     });
};

// get /events/new: send form for creating a new event
exports.new = (req, res) => {
    res.render('./events/newEvent');
};

// post /events: create a new event
exports.create = (req, res) => {
    let formBody = req.body;
    const image = req.file;
    let event = {
        category: formBody.category,
        title: formBody.title,
        hostName: formBody.hostName,
        startDateTime: formBody.startDateTime,
        endDateTime: formBody.endDateTime,
        location: formBody.location,
        details: formBody.details,
    }
    event.image = req.file.filename;
    model.save(event);
    res.redirect('/events');
};

// get /events/:id: send event details of event with given id
exports.show = (req, res) => {
    let id = req.params.id;
    let event = model.findById(id);
    res.render('./events/event', { event });
};

// get /events/:id/edit: send form for editing event with given id
exports.edit = (req, res) => {
    let id = req.params.id;
    let event = model.findById(id);
    if (event){
        res.render('./events/edit', { event })
    } else {
        let err = new Error('Cannot find event with ID ' + id);
        err.status = 404;
        next(err);
    }
};

// put /events/:id: update event with given id
exports.update = (req, res, next) => {
    let event = req.body;
    let image = req.file.filename; 
    let id = req.params.id;
    if (model.updateById(id, event, image)){ 
        console.log(event);
        res.redirect('/events/'+id);
    } else {
        let err = new Error('Cannot find event with ID ' + id);
        err.status = 404;
        next(err);
    }
};

// delete /events/:id: delete event with given id
exports.delete = (req, res) => {
    let id = req.params.id;
    if (model.deleteByID(id)){
        res.redirect('/events');
    } else {
        let err = new Error('Cannot find event with ID ' + id);
        err.status = 404;
        next(err);
    }
};