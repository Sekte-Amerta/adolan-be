var express = require('express');
var router = express.Router();

const { isVerified } = require('../helpers/Authorization')

// const singleUpload = require('../middleware/singleUpload')

const { register, login, activation } = require("../controllers/user.controller");

router.post('/register', register)
router.post('/login', isVerified, login)
router.get('/activation/:token', activation)

module.exports = router;
