var express = require('express');
var router = express.Router();

router.get('/', function(req, res){
    res.render('login', {layout : 'login_head'});
});

//the post request for url validation would go here

module.exports = router;
