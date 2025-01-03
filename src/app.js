const express = require('express');
const app = express();
const path = require('path');
const session = require('express-session');

const skillsRouter = require('./routes/skills.routes');
const usersRouter = require('./routes/users.routes');
const adminRouter = require('./routes/admin.routes');
const errorHandler = require('./middleware/error.middleware');
const connectDB = require('./config/database');
const s = require('./config/addData');

connectDB();
s.addSkills();
s.addBadges();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({
  secret: '123456789',
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge: 6000000 } // Session expires after 60 seconds
}));

app.use('/skills', skillsRouter);
app.use('/users', usersRouter);
app.use('/admin', adminRouter);

//error handler
app.use(errorHandler);

app.get('/', (req, res) => {
  res.redirect('/users/login');
});

app.use(express.static(__dirname + '/public'));



module.exports = app;
