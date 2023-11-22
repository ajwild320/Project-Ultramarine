const myModule = require("../models/event");
const Event = myModule.Event;
const categories = [
  "Warhammer 40K",
  "Warhammer Fantasy",
  "Meet and Chill",
  "Painting Session",
  "Warhammer 30K",
  "Other",
];

// get /events: send all events
exports.index = (req, res) => {
  Event.find()
    .then((events) => {
      res.render("./events/events", {
        events: events,
        categories: categories,
      });
    })
    .catch((err) => {
      next(err);
    });
};

// get /events/new: send form for creating a new event
exports.new = (req, res) => {
  res.render("./events/newEvent");
};

// post /events: create a new event
exports.create = (req, res, next) => {
  const formBody = new Event(req.body);
  formBody.image = req.file.filename;
  formBody.author = req.session.user;
  formBody.save()
  .then((event) => res.redirect('/events'))
    .catch(err=>{
        if(err.name === 'ValidationError' ) {
            err.status = 400;
        }
        next(err);
    });
};

// get /events/:id: send event details of event with given id
exports.show = (req, res, next) => {
  const id = req.params.id;

  Event.findById(id).populate('author', 'firstName lastName')
    .then((event) => {
      if (event) {
        res.render("./events/event", {
          event,
          formatDate: (date) => date.toLocaleString(),
        });
      } else {
        const err = new Error("Cannot find event with ID: " + id);
        err.status = 404;
        next(err);
      }
    })
    .catch((err) => next(err));
};

// get /events/:id/edit: send form for editing event with given id
exports.edit = (req, res, next) => {
  const id = req.params.id;
  Event.findById(id)
    .then((event) => {
      if (event) {
        res.render("./events/edit", { event });
      } else {
        const err = new Error("Cannot find event with ID " + id);
        err.status = 404;
        next(err);
      }
    })
    .catch((error) => {
      console.error("Error in edit:", error);
      res.status(500).send("Internal Server Error");
    });
};

// put /events/:id: update event with given id
exports.update = (req, res, next) => {
  const event = req.body;
  const image = req.file.filename;
  const id = req.params.id;

  Event.findByIdAndUpdate(id, { ...event, image }, { new: true, useFindAndModify: false, runValidators: true })
    .then((updatedEvent) => {
      if (updatedEvent) {
        console.log(event);
        res.redirect("/events/" + id);
      } else {
        const err = new Error("Cannot find event with ID " + id);
        err.status = 404;
        next(err);
      }
    })
    .catch((err) => {
      if(err.name === 'ValidationError')
            err.status = 400;
        next(err);
    });
};

// delete /events/:id: delete event with given id
exports.delete = (req, res, next) => {
  const id = req.params.id;

  Event.findByIdAndDelete(id, {useFindAndModify: false})
    .then((event) => {
      res.redirect("/events");
    })
    .catch((error) => {
      console.error("Error in delete:", error);
      res.status(500).send("Internal Server Error");
    });
};