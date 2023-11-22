// require modules
const express = require('express');
const morgan = require('morgan');
const eventRoutes = require('./routes/eventRoutes');
const mainRoutes = require('./routes/mainRoutes');
const methodOverride = require('method-override');
const mongoose = require('mongoose');
const userRoutes = require('./routes/userRoutes');
const flash = require('connect-flash');
const session = require('express-session');
const MongoStore = require('connect-mongo');

//create app
const app = express();

// configure app
let port = 3000;
let host = 'localhost';
const mongoUrl =  'mongodb+srv://ajwild320:Dodgerdog320@project3.z5v7yml.mongodb.net/?retryWrites=true&w=majority';
app.set('view engine', 'ejs');

// connect to mongodb
mongoose.connect(mongoUrl, {
    useUnifiedTopology: true, // Use the new unified topology engine
    useNewUrlParser: true, // Keep this option for backward compatibility with earlier Mongoose versions
})
.then(() => {
    console.log('Connected to MongoDB');
    app.listen(port, host, () => {
    console.log('Server is running on port', port);
    });
})
.catch(err=>console.log(err.message));

// mount middleware
// creating the session middleware
app.use(
    session({
        secret: "vengeanceForAlderaan",
        resave: false,
        saveUninitialized: false,
        store: new MongoStore({mongoUrl}),
        cookie: {maxAge: 60*60*1000}
        })
);
// setting the flash middleware
app.use(flash());

app.use((req, res, next) => {
    //console.log(req.session);
    res.locals.user = req.session.user||null;
    res.locals.errorMessages = req.flash('error');
    res.locals.successMessages = req.flash('success');
    next();
});

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));
app.use(morgan('dev'));
app.use(methodOverride('_method'));

// set up routes
app.get('/', (req, res) => {
    res.render('index');
});

// mount routes
app.use('/events', eventRoutes);
app.use('/', mainRoutes);
app.use('/users', userRoutes);

// Error Handling
app.use((req, res, next) => {
    let err = new Error('Server Failed to Locate ' + req.url);
    err.status = 404;
    next(err);
});

app.use((err, req, res, next) => {
    console.log(err.stack);
    if(!err.status) {
        err.status = 500;
        err.message = ('Internal Server Error');
    }

    res.status(err.status);
    res.render('error', { error: err, title: 'Error'});
});