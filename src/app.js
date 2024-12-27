const express = require('express');
const path = require('path');
const session = require('express-session');

const skillsRouter = require('./routes/skills.routes');
const usersRouter = require('./routes/users.routes');
const adminRouter = require('./routes/admin.routes');
const errorHandler = require('./middleware/error.middleware');

const mongoose = require('mongoose');
// URI de la bdd
const mongoURI = 'mongodb://127.0.0.1:27017/skills';

const connectDB = async () => {
  try {
    await mongoose.connect(mongoURI);
    console.log('Conexión establecida a MongoDB');
  } catch (error) {
    console.error('Error de conexión:', error);
    process.exit(1);
  }
};

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

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

//const PORT = process.env.PORT || 3000;
//pp.listen(PORT, () => {
//  console.log(`Servidor funcionando en el puerto ${PORT}`);
//});

module.exports = app;
