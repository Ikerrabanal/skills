const User = require('../models/User');
const bcrypt = require('bcrypt');
const Badge = require('../models/Badge');

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

exports.viewBadges = async (req, res, next) => {

    try {
        const badges = await Badge.find(); // Obtiene todos los usuarios de la base de datos
        res.render('allBadges', {user: req.session.user, badges}); // Envía los datos a la vista
    } catch (error) {
        console.error('Error fetching badges:', error);
        res.status(500).send('Internal Server Error');
    }
}

exports.viewoneBadge = async (req, res, next) => {

        const badgeId = req.params.id;
        try {
            const badge = await Badge.findOne({_id: badgeId}); // Obtiene todos los usuarios de la base de datos
            res.render('edit-badge', {user: req.session.user, badge}); // Envía los datos a la vista
        } catch (error) {
            console.error('Error fetching badge:', error);
            res.status(500).send('Internal Server Error');
        }
}


exports.editBadges = async (req, res) => {
    badgeId = req.params.id;
    const { name, range, bitpoints_min, bitpoints_max, image_url } = req.body;
    try {
        const updateBadge = await Badge.findOneAndUpdate(
            {_id: badgeId},
            {
                name: name,
                bitpoints_min: bitpoints_min,
                bitpoints_max: bitpoints_max,
                image_url: image_url
            },
        )
        if (!updateBadge) {
            return res.status(404).send('Error con medalla');
        }

        res.redirect('/admin/manage-badges');
    } catch (error) {
        console.error('Error updating badge:', error);
        res.status(500).send('Internal Server Error');
    }
}

exports.deleteBadges = async (req, res) => {

    const badgeId = req.params.id;
    console.log(badgeId)
    try {
        const deleteBadge = await Badge.findOneAndDelete(
            {_id: badgeId}
        )
        if (!deleteBadge) {
            return res.status(404).send('Error con medalla');
        }

        res.redirect('/admin/manage-badges');
    } catch (error) {
        console.error('Error deleting badge:', error);
        res.status(500).send('Internal Server Error');
    }
}
