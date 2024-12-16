const bcrypt = require('bcrypt');

users = []

exports.renderLogin = async (req, res, next) => {
    try {
        if(!req.session.user) {
            res.render('login');
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
        const user = users.find(user => user.username === username);
        if (!user) {
            return res.status(400).send('User not found');
        }

        const validPassword = await bcrypt.compare(password, user.password);

        if (!validPassword) {
            return res.status(400).send('Invalid password');
        }

        req.session.user = username;

        res.redirect('/skills')
    } catch (error) {
        res.status(500).send('Error logging in');
    }
};

exports.register = async (req, res) => {
    try {
        const { username, password } = req.body;

        if (users.find(user => user.username === username)) {
            return res.status(400).send('Username already exists');
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        users.push({
            username,
            password: hashedPassword
        });

        res.redirect('/users/login')

    } catch (error) {
        res.status(500).send('Error registering user');
    }
};