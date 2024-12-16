var express = require('express');
var router = express.Router();
const skillsController = require('../controllers/skills.controller');

/* GET home page. */
router.get('/', skillsController.renderIndex);

module.exports = router;
