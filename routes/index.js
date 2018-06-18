var express = require('express');
var router = express.Router();
var namesdata = require("../names.json");

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express', namesdata: namesdata});
});

module.exports = router;
