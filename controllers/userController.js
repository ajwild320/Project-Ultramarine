const model = require('../models/user');
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

exports.new = (req, res)=>{
    return res.render('./user/new');
};

exports.create = (req, res, next) => {
  let user = new model(req.body);
  user
    .save()
    .then((user) => res.redirect("/users/login"))
    .catch((err) => {
      if (err.name === "ValidationError") {
        req.flash("error", err.message);
        return res.redirect("/users/new");
      }

      if (err.code === 11000) {
        req.flash("error", "Email has been used");
        return res.redirect("/users/new");
      }

      next(err);
    });
};

exports.getUserLogin = (req, res, next) => {
    return res.render('./user/login');
}

exports.login = (req, res, next) => {
  let email = req.body.email;
  let password = req.body.password;
  model.findOne({ email: email })
    .then((user) => {
      if (!user) {
        console.log("wrong email address");
        req.flash("error", "wrong email address");
        res.redirect("/users/login");
      } else {
        user.comparePassword(password).then((result) => {
          if (result) {
            req.session.user = user._id;
            req.flash("success", "You have successfully logged in");
            res.redirect("/users/profile");
          } else {
            req.flash("error", "wrong password");
            res.redirect("/users/login");
          }
        });
      }
    })
    .catch((err) => next(err));
};

exports.profile = (req, res, next) => {
  const userId = req.session.user;
  let User = model;

  // Fetch the user to get their events
  User.findById(userId)
    .then((user) => {
      if (!user) {
        // Handle the case where the user is not found
        return res.status(404).send('User not found');
      }

      // Now, fetch events for the specific user
      return Event.find({ author: userId }).then((events) => ({ user, events }));
    })
    .then(({ user, events }) => {
      res.render('./user/profile', {
        user: user,
        events: events,
        categories: categories,
      });
    })
    .catch((err) => {
      next(err);
    });
};


exports.logout = (req, res, next)=>{
    req.session.destroy(err=>{
        if(err) 
           return next(err);
       else
            res.redirect('/');  
    });
};