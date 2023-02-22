var express = require('express');
var router = express.Router();

// var companyRouter = require("../routes/company");
var catalogRouter = require("../routes/catalog");
var userRouter = require("../routes/users");

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

// router.use("/company", companyRouter);
router.use("/catalog", catalogRouter);
router.use("/auth", userRouter);

module.exports = router;
