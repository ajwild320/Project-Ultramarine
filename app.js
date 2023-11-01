// require modules
const express = require('express');
const morgan = require('morgan');
const eventRoutes = require('./routes/eventRoutes');
const mainRoutes = require('./routes/mainRoutes');
const methodOverride = require('method-override');
const mongoose = require('mongoose');

//create app
const app = express();

// configure app
let port = 3000;
let host = 'localhost';
const mongoURL =  'mongodb+srv://ajwild320:Dodgerdog320@project3.z5v7yml.mongodb.net/?retryWrites=true&w=majority';
app.set('view engine', 'ejs');

// connect to mongodb
mongoose.connect(mongoURL, {
    useUnifiedTopology: true, // Use the new unified topology engine
    useNewUrlParser: true, // Keep this option for backward compatibility with earlier Mongoose versions
})
.then(() => {
    console.log('Connected to MongoDB');
    app.listen(port, () => {
    console.log('Server is running on port', port);
    });
})
.catch(err => {
    console.error('Error connecting to MongoDB:', err);
});

// mount middleware
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

// Error Handling
app.use((req, res, next) => {
    let err = new Error('Server Failed to Locate ' + req.url);
    err.status = 404;
    next(err);
});

app.use((err, req, res, next) => {
    if(!err.status) {
        err.status = 500;
        err.message = ('Internal Server Error');
    }
    res.status(err.status);
    res.render('error', { error: err, title: 'Error'});
});