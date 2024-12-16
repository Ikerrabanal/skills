const express = require('express');
const router = express.Router();
const usersController = require('../controllers/users.controller');

router.get('/login', usersController.renderLogin);
router.post('/login', usersController.login);

router.get('/register', usersController.renderRegister);
router.post('/register', usersController.register);

module.exports = router;