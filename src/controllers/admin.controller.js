const User = require('../models/User');
const bcrypt = require('bcrypt');

exports.viewUsers = async (req, res, next) => {
    try {
        const users = await User.find(); // Obtiene todos los usuarios de la base de datos
        res.render('edit-users', {user: req.session.user, users}); // Envía los datos a la vista
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).send('Internal Server Error');
    }
};

exports.editUsers = async (req, res) => {
    const { userId, password } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const updateUser = await User.findOneAndUpdate(
            {username: userId},
            {
                password: hashedPassword,
            },
        )
        if (!updateUser) {
            return res.status(404).send('Error con usuario');
        }

        res.redirect('/admin/users');
    } catch (error) {
        console.error('Error updating password:', error);
        res.status(500).send('Internal Server Error');
    }
};

