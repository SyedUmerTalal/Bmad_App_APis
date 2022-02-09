const util = require("util");
const path = require("path");
const multer = require("multer");

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './upload/post_media')
      },
  filename: (req, file, callback) => {
    const match = [ '.mp4', '.mov', '.wmv', '.avi', '.jpeg', '.jpg', '.png', '.gif', '.mp3', '.wav'];

    if (match.indexOf(file.mimetype) === -1) {
      var message = `${file.originalname} is invalid. Only accept png/jpeg.`;
      return callback(message, null);
    }

    var filename = `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`;
    callback(null, filename);
  },


});


// const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//         cb(null, './upload/post_media')
//       },
//     // destination: './upload/post_media',
//     filename: (req, file, cb) => {
           
//         return cb(null, `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`); 

//     }
// });

var uploadFiles = multer({ storage: storage }).array("multi-files", 10);
var uploadFilesMiddleware = util.promisify(uploadFiles);
module.exports = uploadFilesMiddleware;