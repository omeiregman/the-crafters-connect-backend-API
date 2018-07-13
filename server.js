const express = require('express');
const cors = require('cors')
const dotenv = require("dotenv").config();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const passport = require('passport');

const users = require('./routes/api/users');
const crafters = require('./routes/api/crafters');
const profiles = require('./routes/api/profiles');
const posts = require('./routes/api/posts');
const events = require('./routes/api/events');

const app = express();

app.use(cors());

//Middlewarre
app.use('/uploads', express.static('uploads'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


//DB Config
const db = process.env.MONGO_URI;

// Connect to mongodb
mongoose.connect(db).then(() => console.log('mongodb connected')).catch(err => console.log(err));


//Passport middleware
app.use(passport.initialize());

//Passport Config
require('./config/passport.js')(passport);



//Use  routes
app.use('/api/users', users);
app.use('/api/crafters', crafters);
app.use('/api/profiles', profiles);
app.use('/api/posts', posts);
app.use('/api/events', events);

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server running on port ${port}`));
