const express = require('express');
const path = require('path');
const session = require('express-session');

const skillsRouter = require('./routes/skills.routes');
const usersRouter = require('./routes/users.routes');
const adminRouter = require('./routes/admin.routes');
const errorHandler = require('./middleware/error.middleware');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({
  secret: '123456789',
  resave: false,
  saveUninitialized: true
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

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor funcionando en el puerto ${PORT}`);
});

module.exports = app;
