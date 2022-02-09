'user strict';
const sql = require('../connection');
const multer = require('multer');
const path = require('path');
const { authSchema } = require('../helper/validation_schema');
const { json } = require('body-parser');
var foreach = require('async-foreach')
const allowedFileTypes = [ '.mp4', '.mov', '.wmv', '.avi', '.jpeg', '.jpg', '.png', '.gif', '.mp3', '.wav', '.JPG'];

function getPostType(file_ext) {
    if (file_ext == '.mp4' || file_ext == '.mov' || file_ext == '.wmv' || file_ext == '.avi') {
        return 'video';
    } else if (file_ext == '.jpeg' || file_ext == '.jpg' || file_ext == '.png' || file_ext == '.gif'|| file_ext == '.JPG') {
        return 'image';   
    } else if (file_ext == '.mp3' || file_ext == '.wav') {
        return 'audio';
    }
}

// done
exports.editProfile = async (req, res) => {
 
    var file_url, post_type = 'text';
    try {
        if (req.files.length < 0) {
            //post without file   
            file_url = "";  
            return res.send(`no file select`);
        } else {
            //post with file
            // console.log(req.files.length)
           var file_URL = []
            for(var i = 0; i < req.files.length; i++ ){
                var obj = req.files[i];
                const file_ext = path.extname(obj.originalname);
                file_url = `http://localhost:5000/post_file/${obj.filename}`;
                if(!allowedFileTypes.includes(file_ext)){
                    return res.json({
                        status: false,
                        msg: `${file_ext} File type not supported`,
                        data: []
                    })
                } 
                // console.log(obj.filename)
                file_URL.push(file_url)
                post_type = getPostType(file_ext);
                // console.log(post_type)
            }
            // return res.send(change);
        }
        // console.log(post_type)
        var files_url = JSON.stringify(file_URL)
        const body = req.body;
        const { 
            user_id,
            user_name,
            user_bio,
            user_title,
            user_address,
            user_lives,
            user_relation,
         } = body
         sql.query('SELECT * FROM user WHERE user_id = ?', 
         [ user_id ], (err, row) => {
             if(!err){
                 if(row.length > 0){
                     sql.query(`UPDATE user SET user_name = ?, user_bio = ?, user_title = ?,  user_address = ?, user_lives = ?, user_relation = ?, user_image = ?, user_coverImage = ? WHERE user_id=${user_id}`, [
                        user_name,
                        user_bio,
                        user_title,
                        user_address,
                        user_lives,
                        user_relation,
                        file_URL[0],
                        file_URL[1],
              ] , (err, rows) =>{
                         if(err){
                             return res.json({
                                     status: false,
                                     msg: err,
                                     data: []
                              })  
                         }else{
                          return res.json({
                                 status: true,
                                 msg: 'Profile updated',
                                 data: {
                                     "Id": user_id,
                                     "User_Images": files_url
                             }
                          })  
                         }
                     }
                 )}
             }
     })
    }
    catch(err){
        console.log(err)
        return res.send(err);
    }
}

// done
exports.nearMe = async (req, res) =>{
    try {  
    const body = req.query;
    const { user_latitude, user_longitude, kilometers } = body
    // return res.send("Work");
    sql.query(`SELECT * FROM (SELECT *,
        (
            (
                (
                    acos(
                        sin(( ${user_latitude} * pi() / 180))
                        *
                        sin(( user_latitude * pi() / 180)) + cos(( ${user_latitude} * pi() /180 ))
                        *
                        cos(( user_latitude * pi() / 180)) * cos((( ${user_longitude} - user_longitude) * pi()/180)))
                ) * 180/pi()
            ) * 60 * 1.1515 * 1.609344
        )
        as distance FROM user
        ) user
        WHERE distance <= ${kilometers}
        LIMIT 15
        `, (err, result)=>{
            console.log(result);
            if(!err){
                return res.send(result); 
            }else{
               return res.send(result);  
            }
        })
    } catch(e) {
        console.log('Catch an error: ', e);
        return res.json({
            status: false,
            msg: 'Something went wrong',
            data: []
        }) 
    }
}

//done
exports.createPost = async (req, res) =>{
    var file_url, post_type = 'text';
    try {
        if (req.file == undefined) {
            //post without file
            file_url = "";     
        } else {
            //post with file
            const file_ext = path.extname(req.file.originalname);
            file_url = `http://localhost:5000/post_file/${req.file.filename}`;
            if(!allowedFileTypes.includes(file_ext)){
                return res.json({
                    status: false,
                    msg: `${file_ext} File type not supported`,
                    data: []
                })
            } 
            post_type = getPostType(file_ext);
        }
        const body = req.body;
        const { user_id, post_title, post_desc } = body
        sql.query('INSERT INTO post ( user_id, post_title, post_url, post_desc, post_type ) VALUES (?,?,?,?,?)', [user_id, post_title, file_url, post_desc, post_type] , (err, result) =>{
            if (!err) {
                return res.json({
                    status: true,
                    msg: 'Post created successfully',
                    data: [{
                        id : result.insertId,
                        post_url: file_url
                    }]
                })
            } else{
                return res.send(err);
            }
        })
    } catch(e) {
        console.log('Catch an error: ', e);
        return res.json({
            status: false,
            msg: 'Something went wrong',
            data: []
        }) 
    }
}

//done
exports.createpostmulti = async (req, res) =>{

    var file_url, post_type = 'text';
    // console.log(req.files.length)
    try {

        if (req.files.length < 0) {
            //post without file   
            file_url = "";  
            return res.send(`no file select`);
             
        } else {
            //post with file
            // console.log(req.files.length)
           var file_URL = []
            for(var i = 0; i < req.files.length; i++ ){
                var obj = req.files[i];
                const file_ext = path.extname(obj.originalname);
                file_url = `http://localhost:5000/post_file/${obj.filename}`;
                if(!allowedFileTypes.includes(file_ext)){
                    return res.json({
                        status: false,
                        msg: `${file_ext} File type not supported`,
                        data: []
                    })
                } 
                // console.log(obj.filename)
                file_URL.push(file_url)
                post_type = getPostType(file_ext);
                // console.log(post_type)
            }
            // return res.send(change);
        }
        // console.log(post_type)
        var files_url = JSON.stringify(file_URL)
        const body = req.body;
        const { user_id, post_title, post_desc } = body
        sql.query('INSERT INTO post ( user_id, post_title, post_url, post_desc, post_type ) VALUES (?,?,?,?,?)', [user_id, post_title, files_url, post_desc, post_type] , (err, result) =>{
            if (!err) {
                return res.json({
                    status: true,
                    msg: 'Post created successfully',
                    data: [{
                        id : result.insertId,
                        post_url: files_url
                    }]
                })
            } else{
                return res.send(err);
            }
        })
    } catch(e) {
        console.log('Catch an error: ', e);
        return res.json({
            status: false,
            msg: 'Something went wrong',
            data: []
        }) 
    }

}

// baad mai
exports.updatePost = async (req, res) =>{
    
    var file_url, post_type = 'text';
    try {

        if (req.file == undefined) {
            //post without file
            file_url = "";     
        } else {
            //post with file
            const file_ext = path.extname(req.file.originalname);

            file_url = `http://localhost:5000/post_file/${req.file.filename}`;

            if(!allowedFileTypes.includes(file_ext)){
                return res.json({
                    status: false,
                    msg: `${file_ext} File type not supported`,
                    data: []
                })
            } 

            post_type = getPostType(file_ext);
        }

        const { post_title, post_desc , post_id } = req.body;
        sql.query('UPDATE post SET post_title = ? , post_url = ?, post_desc = ?, post_type = ? WHERE post_id = ?', [ post_title, file_url, post_desc, post_type, post_id] , (err, result) =>{
            if (!err) {
                console.log(result);
                return res.json({
                    status: true,
                    msg: 'Post updated successfully',
                    data: []
                })
            } else{
                return res.send(err);
            }
        })
    } catch(e) {
        console.log('Catch an error: ', e);
        return res.json({
            status: false,
            msg: 'Something went wrong',
            data: []
        }) 
    }

}

//baad mai
exports.deletePost = async (req, res) =>{

    try {
        const post_id = req.body.post_id;
        console.log('Post id', post_id);
        sql.query('DELETE FROM post WHERE post_id = ?', post_id , (err, result) =>{
            if (!err) {
                return res.json({
                    status: true,
                    msg: 'Post deleted successfully',
                    data: []
                })
            } else{
                return res.send(err);
            }
        })
    } catch(e) {
        console.log('Catch an error: ', e);
        return res.json({
            status: false,
            msg: 'Something went wrong',
            data: []
        }) 
    }

}

//done
exports.getmyfeed = async (req, res) =>{

    try {
        sql.query(`SELECT post.*,  count(comments.comment_id) as 'total_comments', count(likes.likes_id) as 'total_likes' FROM post 
        LEFT JOIN likes ON post.post_id = likes.post_id
        LEFT JOIN comments ON post.post_id = comments.post_id 
        WHERE post.user_id = ? GROUP BY post.post_id `, req.query.id , (err, result) =>{
            if (!err) {
                return res.json({
                    status: true,
                    msg: 'Posts fetched successfully',
                    data: result
                })
            } else{
                return res.send(err);
            }
        })
    } catch(e) {
        console.log('Catch an error: ', e);
        return res.json({
            status: false,
            msg: 'Something went wrong',
            data: []
        }) 
    }

}

//done
// exports.getfeed = async (req, res) =>{

//     try {
//         function allDone(notAborted, arr) {
//             console.log("done", notAborted, arr);
//           }
           
//         console.log(req.query.id)
//         var forEach = require('async-foreach').forEach;
//         forEach(["a", "b", "c"], function(item, index, arr) {
//           console.log("each", item, index, arr);
      
//         }, allDone)

//         sql.query(`SELECT post.*, following.* FROM post 
//                     INNER JOIN following ON following.following_to = post.user_id
//                     WHERE following.user_id = ? `, req.query.id, (err, result) =>{
//             if (!err) {
//                 // console.log(result)
//                 return res.json({
//                     status: true,
//                     msg: 'Feed fetched successfully',
//                     data: result
//                 })
//             } else{
//                 return res.send(err);
//             }
//         })
//     } catch(e) {
//         console.log('Catch an error: ', e);
//         return res.json({
//             status: false,
//             msg: 'Something went wrong',
//             data: []
//         }) 
//     }

// }


exports.getfeed = async (req, res) =>{
    try{
    // var data = {
    //     'post_user_image': null,
    //     'post_username': null,
    //     'post_url': null,
    //     'post_desc': null,
    //     'post_tag': null,
    //     'post_date': null,
    //     'post_title': null,
    //     'post_Following_User': null,
    //     'post_comments_data': null

    // }
    sql.query(`SELECT user.user_image, user.user_name, post.post_id, post.created_at post.user_id as PostedBy, post.post_title, post.post_url, post.post_desc, post.post_status, following.user_id as Following_User FROM post 
                INNER JOIN following ON following.following_to = post.user_id
                INNER JOIN user ON user.user_id = post.user_id
                WHERE following.user_id = ?`, req.query.id, (err, result) =>{
                    //  if (error) return res(error);
                    // console.log(result)
                    foreach.forEach(result, function(item, index, arr) {
                            // console.log("For each called", item)
                            var done = this.async();
                            console.log(item)
                            // data.post_user_image = item.user_image
                            // data.post_username = item.user_name
                            // data.post_url = item.post_url
                            // data.post_desc = item.post_desc
                            // data.post_date = item.created_at
                            // data.post_title = item.post_title
                            // data.post_Following_User = item.Following_User
                          
                            
                          
                            sql.query(`SELECT comments.*, user.user_image, user.user_name FROM comments LEFT JOIN user ON user.user_id = ? WHERE comments.post_id = ?`, [item.user_id ,item.post_id],  function(err, commentResult) {
                            // console.log(commentResult)
                            // data.post_comments_data = item.user_name
                                // data.username = 
                                // item.comments = commentResult;
                                // if (!err) {
                                //                     // console.log(result)
                                //                     return res.json({
                                //                         status: true,
                                //                         msg: 'Feed fetched successfully',
                                //                         data: commentResult
                                //                     })
                                //                 } else{
                                //                     return res.send(err);
                                //                 }
                                // sql.query(`SELECT comments.*,u.user_name, u.user_image from comments INNER JOIN user on user.user_id = comments.user_id where c.comment_id IN (SELECT MAX(com.comment_id) from comment as com where com.user_id = c.user_id AND post_id = '${item.post_id}') limit 5`, (error, top5Res) => {
                                //     item.top5Comment = top5Res;
                                //     if (result.length != index + 1) done()
                                //     if (result.length == index + 1) return res(null, result);
                                // })
                                done()
                            });
                            // done()

        },()=>{
            console.log("Khatam loop")
        });
    })
    return res.json({
                        status: 'Success',
                        // response: result
                    })
    }
    catch(err){
        console.log(err)
        return res.json({error: err})
    }
}

//done
exports.like = async (req, res) =>{

    try {
        const { post_id, user_id, generated_by } = req.body;
        sql.query('INSERT INTO likes (post_id, user_id, generated_by) VALUES (?,?,?) ON DUPLICATE KEY UPDATE post_id = ? , generated_by = ?', [ post_id, user_id, generated_by, post_id, generated_by ] , (err, result) =>{
            if (!err) {
                return res.json({
                    status: true,
                    msg: 'Post liked successfully',
                    data: []
                })
            } else{
                return res.send(err);
            }
        })
    } catch(e) {
        console.log('Catch an error: ', e);
        return res.json({
            status: false,
            msg: 'Something went wrong',
            data: []
        }) 
    }

}

//done
exports.unlike = async (req, res) =>{
    try {
        const likes_id = req.body.likes_id;
        sql.query('DELETE FROM likes WHERE likes_id = ?', [ likes_id ] , (err, result) => { 
            if (!err) {
                return res.json({
                    status: true,
                    msg: 'Post unliked successfully',
                    data: []
                })
            } else{
                return res.send(err);
            }
        })
    } catch(e) {
        console.log('Catch an error: ', e);
        return res.json({
            status: false,
            msg: 'Something went wrong',
            data: []
        }) 
    }

}

//done
exports.createcomment = async (req, res) =>{

    try {
        const { post_id, comment_sender_id, comment_text } = req.body;
        console.log(post_id)
        sql.query('INSERT INTO comments (comment_text, comment_sender_id, post_id) VALUES (?,?,?)', [ comment_text, comment_sender_id,  post_id] , (err, result) =>{
            if (!err) {
                console.log(result);

                return res.json({
                    status: true,
                    msg: 'Comment done successfully',
                    data: []
                })

                // sql.query('INSERT INTO comments (comment_id, comment_text, post_id) VALUES (?,?,?)', [ result.insertId, comment_text, post_id ], (err, comment_result) =>{
                //         if (!err) {
                //             return res.json({
                //                 status: true,
                //                 msg: 'Comment done successfully',
                //                 data: []
                //             })
                //         } else{
                //             return res.send(err);
                //         }
                // })
            } else{
                return res.send(err);
            }
        })
    } catch(e) {
        console.log('Catch an error: ', e);
        return res.json({
            status: false,
            msg: 'Something went wrong',
            data: []
        }) 
    }

}

//done
exports.updatecomment = async (req, res) =>{
    try {
        const { comment_id, comment_text } = req.body;
        sql.query('UPDATE comments SET comment_text = ? WHERE comment_id = ?', [ comment_text, comment_id] , (err, result) =>{
            if (!err){
                console.log(result);
                if (!err) {
                    return res.json({
                        status: true,
                        msg: 'Comment updated successfully',
                        data: []
                    })
                } else{
                    return res.send(err);
                }
            } else{
                    return res.send(err);
            }
        })
    } catch(e) {
        console.log('Catch an error: ', e);
        return res.json({
            status: false,
            msg: 'Something went wrong',
            data: []
        }) 
    }
}

//done
exports.deletecomment = async (req, res) =>{
    try {
        const comment_id = req.body.comment_id;
        sql.query('DELETE FROM comments WHERE comment_id = ?', comment_id , (err, result) =>{
            if (!err) {
                return res.json({
                    status: true,
                    msg: 'Comment deleted successfully',
                    data: []
                })
            } else{
                return res.send(err);
            }
        })
    } catch(e) {
        console.log('Catch an error: ', e);
        return res.json({
            status: false,
            msg: 'Something went wrong',
            data: []
        }) 
    }
}