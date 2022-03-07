'user strict';
const sql = require('../connection');
const { authSchema } = require('../helper/validation_schema');
//done
exports.follow = async (req, res) =>{

    try {
        const body = req.body;
        const { user_id, follow_id , status} = body
        sql.query('INSERT INTO following ( user_id, following_to, status ) VALUES (?,?,?) ON DUPLICATE KEY UPDATE user_id = ? , following_to = ? ,status = ? ', [user_id, follow_id, status, user_id, follow_id ,status ] , (err, following_result) =>{
            if (!err) {
                        return res.json({
                            status: true,
                            msg: 'Follow Request Sent',
                            follow_status: 2 
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
exports.followAcpt = async (req, res) =>{

    try {
        const body = req.body;
        const { user_id, following_to , status} = body
        sql.query('UPDATE following SET status = ? WHERE user_id= ? AND following_to = ?', [status, user_id , following_to] , (err, following_result) =>{
            if (!err) {
                        return res.json({
                            status: true,
                            msg: 'Follow Request Accepted',
                            follow_status: 1 
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
exports.unfollow = async (req, res) =>{

    try {
        const body = req.body;
        const { user_id, follow_id } = body

        sql.query('DELETE FROM following WHERE user_id = ? AND following_to = ?', [user_id, follow_id ] , (err, following_result) =>{
            if (!err) {
                        return res.json({
                            status: true,
                            msg: 'Unfollow Success',
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
exports.followRequestStatus = async (req, res) => {
    
    try {
        const body = req.query;
        const { user_id, following_to } = body
        // 'UPDATE follower SET status = ? WHERE following_to = ?, user_id = ?',
                sql.query('SELECT * FROM following  WHERE  user_id = ? AND following_to = ?', [user_id, following_to ] , (err, follower_result) =>{
                    if (!err) {          
                            if(follower_result.length>0){
                                if(follower_result[0].status == 2){
                                    return res.json({
                                        status: true,
                                        msg: 'Requested',
                                        follow_status: 2
                                    })
                                }else if (follower_result[0].status == 1){
                                    return res.json({
                                        status: true,
                                        msg: 'Accepted',
                                        follow_status: 1
                                    })
                                }
                                
                                
                            }else{
                                return res.json({
                                    status: true,
                                    msg: 'Nothing',
                                    follow_status: 0
                                })
                            }
                        }else{
                            return res.json({
                                status: true,
                                msg: 'Nothing',
                                follow_status: 0
                            })
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

exports.followrequestrej = async (req, res) => {
    
    try {
        const body = req.body;
        const { user_id, follow_id } = body

        sql.query('DELETE FROM following WHERE user_id = ? AND following_to = ?', [user_id, follow_id ] , (err, following_result) =>{
            if (!err) {

                sql.query('DELETE FROM follower WHERE user_id = ? AND followed_by = ?', [follow_id, user_id ] , (err, follower_result) =>{
                    if (!err) {
                        console.log(following_result, follower_result);
                        return res.json({
                            status: true,
                            msg: 'Rejected Success',
                            data: []
                        })
                    } else{
                        return res.send(err);
                    }        
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

exports.getFollowers = async (req, res) => {
    try {
        const body = req.query;
        const {user_id} = body
                sql.query('SELECT following_to  FROM following WHERE user_id = ? AND status = 1', [user_id] , (err, result) =>{
                    if (!err) {
                        return res.json({
                            status: true,
                            msg: 'Followers Fetched',
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

exports.UserUnlike = async (req, res) =>{

    try {
        const { user_id, like_by } = req.body;
                sql.query(' SELECT * FROM user_likes WHERE user_id = ? AND like_by = ? ', [user_id,like_by] ,  (err, result) =>{
                    if (!err) {

                        if(result.length > 0){
                                sql.query('DELETE FROM user_likes WHERE user_id = ? AND like_by = ?', [user_id, like_by ] , (err, following_result) =>{
                                    if (!err) {
                                            
                                        return res.json({
                                            status: true,
                                            msg: 'Unliked',
                                            data: []
                                        })              
                                    } else{
                                        return res.send(err);
                                    }
                                })

                            }else{
                                    return res.json({
                                                    status: true,
                                                    msg: 'Already UnLiked',
                                                    data: []
                                                })
                            
                            }
                 }})
        }
                 
        catch(e) {
            console.log('Catch an error: ', e);
            return res.json({
                status: false,
                msg: 'Something went wrong',
                data: []
            }) 
        }

}

exports.Userlike = async (req, res) =>{

    try {
        const { user_id, like_by } = req.body;
                sql.query(' SELECT * FROM user_likes WHERE user_id = ? AND like_by = ? ', [user_id,like_by] ,  (err, result) =>{
                    if (!err) {

                        if(result.length > 0){
                                return res.json({
                                    status: true,
                                    msg: 'Already Liked',
                                    data: []
                                })
                                
                            }else{

                                sql.query('INSERT INTO user_likes (user_id, like_by) VALUES (?,?)',[user_id,like_by], (err, result) =>{

                                    return res.json({
                                                    status: true,
                                                    msg: 'Liked Successfully',
                                                    data: []
                                                })
                                });
                            
                            }
                 }})
        }
                 
        catch(e) {
            console.log('Catch an error: ', e);
            return res.json({
                status: false,
                msg: 'Something went wrong',
                data: []
            }) 
        }

}

exports.Userstatus = async (req, res) =>{
    try {
        const body = req.query;
        const {user_id, like_by} = body;

        sql.query(' SELECT * FROM user_likes WHERE user_id = ? AND like_by = ? ', [user_id,like_by] ,  (err, result) =>{

            if (!err) {

                if(result.length > 0){

                    return res.json({
                        status: true,
                        msg: 'Liked',
                        like_status: true
                    })
                }else{
                    return res.json({
                        status: true,
                        msg: 'Unliked',
                        like_status: false
                    })
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

exports.likecount = async (req, res) =>{
    try {
        const body = req.body;
        const {user_id} = body;
        sql.query('SELECT COUNT(like_by) as total_like FROM user_likes WHERE user_id=16', [ user_id] , (err, result) => { 
            if (!err) {
                return res.json({
                    status: true,
                    msg: 'Like Fetched successfully',
                    data: result[0]
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