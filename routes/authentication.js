var express = require('express');
var Router = express.Router();
var authController = require('../controllers/auth_controller');

var router = function(){
    Router.put('/updateLocation', authController.updateLocation)
    Router.post('/register', authController.register);
    Router.post('/login', authController.login);
    Router.get('/userInfo', authController.userInfo);
    Router.get('/otp', authController.otp);
    Router.get('/verify', authController.verify);
    return Router
}

module.exports = router();