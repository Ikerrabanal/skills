const bcrypt = require('bcrypt');

const User = require('../models/User');

exports.renderLogin = async (req, res, next) => {
    try {
        if(!req.session.user) {
            res.render('login', {message: ''});
        } else {
            res.redirect('/skills');
        }
    } catch (error) {
        next(error);
    }
};

exports.renderRegister = async (req, res, next) => {
    try {
        if(!req.session.user) {
            res.render('register');
        } else {
            res.redirect('/skills');
        }
    } catch (error) {
        next(error);
    }
};

exports.login = async (req, res, next) => {
    try {

        const { username, password } = req.body;
        const user = await User.findOne({ username: username }).exec();

        if (!user) {
            return res.status(400).send('User not found');
        }

        const validPassword = await bcrypt.compare(password, user.password);

        if (!validPassword) {
            return res.status(400).send('Invalid password');
        }

        req.session.user = { _id: user._id, username: user.username, isAdmin: user.admin };

        res.redirect('/skills')
    } catch (error) {
        console.log(error);
        res.status(500).send('Error logging in');
    }
};

exports.isAdmin = (req, res, next) => {
    const user = users.find(user => user.username === req.session.user);
    if (user && user.admin) {
        next();
    } else {
        res.status(403).send('Denied access. Only admin.');
    }
};


exports.register = async (req, res) => {
    try {
        const { username, password } = req.body;

        // Verificar si el usuario ya existe
        if (await User.findOne({ username: username }).exec()) {
            return res.status(400).send('Username already exists');
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        // Verificar si existen Usuarios
        const isAdmin = await User.countDocuments({}).exec() === 0;


        const user = new User({ username, password: hashedPassword, admin: isAdmin });
        const savedUser = await user.save();

        res.redirect('/users/login')

    } catch (error) {
        res.status(500).send('Error registering user');
    }
};

// Logout
exports.logout = async (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).send('Error al cerrar sesión');
        }
        // Pasar mensaje a la vista
        res.render('login', {message: 'Sesión cerrada correctamente'});
    });
}
