'user strict';
const sql = require('../connection');
const multer = require('multer');
const path = require('path');
const { authSchema } = require('../helper/validation_schema');
const { json } = require('body-parser');
var foreach = require('async-foreach')
const allowedFileTypes = [ '.mp4', '.mov', '.wmv', '.avi', '.jpeg', '.jpg', '.png', '.gif', '.mp3', '.wav', '.JPG', '.PNG'];

function getPostType(file_ext) {
    if (file_ext == '.mp4' || file_ext == '.mov' || file_ext == '.wmv' || file_ext == '.avi') {
        return 'video';
    } else if (file_ext == '.jpeg' || file_ext == '.jpg' || file_ext == '.png' || file_ext == '.gif'|| file_ext == '.JPG' || file_ext == '.PNG') {
        return 'image';   
    } else if (file_ext == '.mp3' || file_ext == '.wav') {
        return 'audio';
    }
}

// done
exports.editProfile = async (req, res) => {
  console.log("SADSAD")
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
            for(var i = 0; i < req.files?.length; i++ ){
                var obj = req.files[i];
                const file_ext = path.extname(obj.originalname);
                file_url = `https://600e-110-93-244-255.ngrok.io/post_file/${obj.filename}`;
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
                 if(row?.length > 0){
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


function  updateFollow(modify,user_id,follower) {
    return new  Promise( (resolve, reject) =>  {
        try{
            sql.query(`SELECT * FROM following where following_to = ${user_id} AND user_id = ${follower} `, (err, result)=>{    
                console.log(result)
                if(result.status == 2){
                    modify.is_follow = 2;
                    }else if(result.status == 1){
                        modify.is_follow = 1;
                    }else{
                        modify.is_follow = 0;
                    }
            resolve(modify);  
        });
        }catch(err){
            reject(err)
        }
      
    });
}

function  updateLike(modify,user_id,likes) {
    return new  Promise( (resolve, reject) =>  {
        try{
        sql.query(`SELECT * FROM user_likes where  user_likes  user_id = ${user_id} AND like_by = ${likes}`, (err, result)=>{            
                    if(result){
                        modify.is_like = true;
                    }else{
                        modify.is_like = false;
                    }
                resolve(modify);  
            });
        }catch(err){
            reject(err)
        }
    });
}

function  LikeCount(modify,user_id) {
    return new  Promise( (resolve, reject) =>  {
        try{

        
        sql.query(`SELECT count(like_by) as total_like FROM user_likes where user_id = ${user_id} `, (err, result)=>{        
           
        // if(result){
            if(result?.length>0){
                modify.like = result[0].total_like;
            }
            
            else{
                modify.like = 0;
            }
             resolve(modify);  
            
             
            });
        }catch(err){
            reject(err)
        }
    });
}
  
// done
exports.nearMe = async (req, res) =>{
    try {  
    const body = req.query;
    const { user_latitude, user_longitude, kilometers, user_id } = body
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
        WHERE distance <= ${kilometers} AND user_id != ${user_id}
        LIMIT 15
        `, (err, result)=>{
            if(!err){
            
                
                resu = [];
                resut = [];
                total = [];
                 
               const modify =[]
                result.map((item)=>{
                    // console.log(item)
                    if(item.user_interest){
                        item.user_interest = JSON.parse(item.user_interest)
                    }
                    if(item.user_gender_interest){
                        item.user_gender_interest = JSON.parse(item.user_gender_interest)
                    }
                    if(item.user_favorite){
                        item.user_favorite = JSON.parse(item.user_favorite)
                    }


                    // item.user_favorite = JSON.parse(item.user_favorite)
                    // item.user_gender_interest = JSON.parse(item.user_gender_interest)

                    resu.push(updateFollow(item,item.user_id,user_id));
                    resut.push(updateLike(item,item.user_id,user_id));
                    total.push(LikeCount(item,item.user_id,user_id));

                    modify.push(resu);
                    modify.push(resut);
                    modify.push(total);
                    
                })

                Promise.all(resu).then(values => {                    
                      return res.send(values);
                }).catch((err)=>{
                    return res.send(err);
                  });

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
            file_url = `https://3a9b-103-244-176-173.ngrok.io/post_file/${req.file.filename}`;
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

        if (req.files?.length < 0) {
            //post without file   
            file_url = "";  
            return res.send(`no file select`);
             
        } else {
            //post with file
            // console.log(req.files.length)
           var file_URL = []
            for(var i = 0; i < req.files?.length; i++ ){
                var obj = req.files[i];
                const file_ext = path.extname(obj.originalname);
                file_url = `https://3a9b-103-244-176-173.ngrok.io/post_file/${obj.filename}`;
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

            file_url = `https://600e-110-93-244-255.ngrok.io/post_file/${req.file.filename}`;

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
    // var array = []
    sql.query(`SELECT user.user_image, user.user_name, post.post_id, post.user_id as PostedBy, post.post_title, post.post_url, post.post_desc, post.post_status, following.user_id as Following_User FROM post 
                INNER JOIN following ON following.following_to = post.user_id
                INNER JOIN user ON user.user_id = post.user_id
                WHERE following.user_id = ?`, req.query.id, (err, result) =>{
                           if (!err) {
                                        return res.json({
                                            status: true,
                                            msg: 'Feed fetched successfully',
                                            data: result
                                        })
                                    } else{
                                        return res.send(err);
                            }
                    // console.log(result)
                    // var array = []
                    // for(var i = 0; i < result.length; i++ ){
                    //     var obj = result[i];
                    //     // var post_comments_data = []
                    //     var data = {
                    //         'post_user_image': obj.user_image,
                    //         'post_username': obj.user_name,
                    //         'post_url': obj.post_url,
                    //         'post_desc': obj.post_desc,
                    //         'post_tag': null,
                    //         'post_date': obj.created_at,
                    //         'post_title': obj.post_title,
                    //         'post_Following_User': obj.Following_User,
                    //         'post_user_ID': obj.PostedBy,
                    //         'post_ID':obj.post_id,
                    //     }
                        

                    //         // sql.query(`SELECT comments.*, user.user_image, user.user_name FROM comments LEFT JOIN user ON user.user_id = ? WHERE comments.post_id = ?`, [ obj.PostedBy ,obj.post_id],  function(err, commentResult) {
                    //         //     console.log(commentResult)


                    //         // });

                    //   console.log( "Asasdsadsad")
                    //   array.push(data)
                    // }
                  
                 })
                
                    }
                    catch(err){
                        console.log(err)
                        return res.json({error: err})
                    }
}


exports.comments = async (req, res) =>{ 
    const { userId, postId } = req.query
    console.log(userId)
    try{
                   sql.query(`SELECT comments.*, user.user_image, user.user_name FROM comments LEFT JOIN user ON user.user_id = ? WHERE comments.post_id = ?`, [ userId ,postId],  function(err, response) {
                            if (!err) {
                                return res.json({
                                    status: true,
                                    msg: 'Feed fetched successfully',
                                    data: response
                                })
                            } else{
                                return res.json({
                                    status: false,
                                    msg: 'fail',
                                    data: err
                                })
                            }
                    });
    }
    catch(e){
        return res.send(e);
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

