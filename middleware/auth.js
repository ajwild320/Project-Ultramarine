const Event = require('../models/event').Event;
const User = require('../models/user');

// Check if the user is a guest
exports.isGuest = (req, res, next) => {
    if (!req.session.user) {
        return next();
    } else {
        req.flash('error', 'You are already logged in');
        return res.redirect('/users/profile');
    }
};

// Check if the user is authenticated
exports.isLoggedIn = (req, res, next) => {
    if (req.session.user) {
        return next();
    } else {
        req.flash('error', 'You need to log in first!');
        return res.redirect('/users/login');
    }
};

// Check if the user is the author of the event
exports.isAuthor = (req, res, next) => {
    const eventId = req.params.id;

    Event.findById(eventId)
        .then(event => {
            if (event) {
                if (event.author == req.session.user) {
                    return next();
                } else {
                    const err = new Error('Unauthorized to access the resource!');
                    err.status = 401;
                    return next(err);
                }
            } else {
                const err = new Error('Cannot find an event with id ' + eventId);
                err.status = 404;
                return next(err);
            }
        })
        .catch(err => next(err));
};