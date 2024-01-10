const myModule = require("../models/event");
const RSVP = require("../models/rsvp");
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
  formBody
    .save()
    .then((event) => res.redirect("/events"))
    .catch((err) => {
      if (err.name === "ValidationError") {
        err.status = 400;
      }
      next(err);
    });
};

// get /events/:id: send event details of event with given id
exports.show = async (req, res, next) => {
  const id = req.params.id;
  const rsvpCount = req.query.rsvp_count || 0; // Default to 0 if not provided

  try {
    const [event, rsvps, userRsvp] = await Promise.all([
      Event.findById(id).populate("author", "firstName lastName"),
      RSVP.find({ event: id }).populate("user", "firstName lastName"),
      RSVP.findOne({ user: req.session.user, event: id }),
    ]);

    if (!event) {
      const err = new Error("Cannot find event with ID: " + id);
      err.status = 404;
      return next(err);
    }

    res.render("./events/event", {
      event,
      rsvps,
      userRsvp,
      rsvpCount,
      formatDate: (date) => date.toLocaleString(),
    });
  } catch (err) {
    console.error(err);
    const internalErr = new Error("Internal Server Error");
    internalErr.status = 500;
    return next(internalErr);
  }
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

  Event.findByIdAndUpdate(
    id,
    { ...event, image },
    { new: true, useFindAndModify: false, runValidators: true }
  )
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
      if (err.name === "ValidationError") err.status = 400;
      next(err);
    });
};

// delete /events/:id: delete event with given id
exports.delete = async (req, res, next) => {
  const id = req.params.id;

  try {
    // Find the event to get its associated RSVPs
    const event = await Event.findById(id);

    if (!event) {
      const notFoundErr = new Error("Cannot find event with ID: " + id);
      notFoundErr.status = 404;
      throw notFoundErr;
    }

    // Delete the event and its associated RSVPs
    await Promise.all([
      Event.findByIdAndDelete(id, { useFindAndModify: false }),
      RSVP.deleteMany({ event: id }),
    ]);

    res.redirect("/events");
  } catch (error) {
    console.error("Error in delete:", error);

    if (error.status === 404) {
      return next(error);
    }

    res.status(500).send("Internal Server Error");
  }
};


//------------------------------------------------------------------------------------//

// Add the new route for handling RSVP directly on the event detail page
exports.handleRsvp = async (req, res, next) => {
  const eventId = req.params.id;
  const userId = req.session.user;
  const { status } = req.body;

  try {
    // Check if the user is the event host
    const event = await Event.findById(eventId);
    if (!event) {
      const notFoundErr = new Error("Cannot find event with ID: " + eventId);
      notFoundErr.status = 404;
      throw notFoundErr;
    }

    if (event.author.toString() === userId) {
      const forbiddenErr = new Error("You cannot RSVP to your own event.");
      forbiddenErr.status = 403;
      throw forbiddenErr;
    }

    // Find the existing RSVP document or create a new one
    const userRsvp = await RSVP.findOneAndUpdate(
      { user: userId, event: eventId },
      { user: userId, event: eventId, status: status },
      { upsert: true, new: true }
    );

    // Calculate RSVP count with 'YES' status
    const rsvpCount = await RSVP.countDocuments({
      event: eventId,
      status: "YES",
    });

    // Redirect to the event page after handling RSVP
    res.redirect(`/events/${eventId}`);
  } catch (err) {
    if (
      err.status === 403 ||
      err.name === "ValidationError" ||
      err.name === "CastError" ||
      err.status === 404
    ) {
      // Specific handling for forbidden action, validation error, or not found
      return next(err);
    }

    // General internal server error handling with additional logging
    console.error("Error in handleRsvp:", err);
    const internalErr = new Error("Internal Server Error");
    console.error(err.stack);
    internalErr.status = 500;
    return next(internalErr);
  }
};
