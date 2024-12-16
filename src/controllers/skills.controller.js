const path = require("node:path");
exports.renderIndex = async (req, res, next) => {
    try {
        if(req.session.user) {
            res.sendFile(path.join(__dirname, '..', 'public/index.html')); //esta mal, hay que pasarle vista dinamica porque depende de la sesion
        } else {
            res.redirect('/users/login')
        }
    } catch (error) {
        next(error);
    }
};