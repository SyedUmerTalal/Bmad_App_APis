var express = require('express');
var Router = express.Router();
var userController = require('../controllers/user_controller');

var router = function(){

    Router.post('/follow', userController.follow);
    Router.post('/unfollow', userController.unfollow);
    Router.post('/likecount', userController.likecount);
    Router.post('/userlike', userController.Userlike);
    Router.post('/userunlike', userController.UserUnlike);

    Router.put('/followrequestrej', userController.followrequestrej);
    Router.put('/followacpt', userController.followAcpt);

    Router.get('/followstatus', userController.followRequestStatus);
    Router.get('/getfollowers', userController.getFollowers);
    Router.get('/userstatus', userController.Userstatus);

    return Router
}

module.exports = router();