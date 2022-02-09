var express = require('express');
var Router = express.Router();
var postController = require('../controllers/post_controller');
const path = require('path');
const multer = require('multer');

const allowedFileTypes = [ '.mp4', '.mov', '.wmv', '.avi', '.jpeg', '.jpg', '.png', '.gif', '.mp3', '.wav'];

//storage engine
const storage = multer.diskStorage({
    destination: './upload/post_media',
    filename: (req, file, cb) => {
        return cb(null, `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`); 
    }
});
const upload = multer({
   storage
})

var router = function(){
    Router.post('/createpostmulti', upload.array('post_file', 6), postController.createpostmulti);
    Router.post('/createpost', upload.single('post_file'), postController.createPost);
    Router.post('/updatepost', upload.single('post_file'), postController.updatePost);
    Router.put('/editProfile', upload.array('post_file', 2), postController.editProfile)
    Router.post('/deletepost', postController.deletePost);
    Router.get('/getmyfeed', postController.getmyfeed);
    Router.get('/getfeed', postController.getfeed);
    Router.get('/nearMe', postController.nearMe);
    Router.get('/comments', postController.comments);
    Router.post('/like', postController.like);
    Router.post('/unlike', postController.unlike);
    Router.post('/createcomment', postController.createcomment);
    Router.put('/updatecomment', postController.updatecomment);
    Router.delete('/deletecomment', postController.deletecomment);
    return Router
}

module.exports = router();