'user strict';
const sql = require('../connection');
const { authSchema } = require('../helper/validation_schema');
//done
exports.follow = async (req, res) =>{

    try {
        const body = req.body;
        const { user_id, follow_id } = body
        sql.query('INSERT INTO following ( user_id, following_to ) VALUES (?,?) ON DUPLICATE KEY UPDATE user_id = ? , following_to = ?  ', [user_id, follow_id, user_id, follow_id ] , (err, following_result) =>{
            if (!err) {

                sql.query('INSERT INTO follower ( user_id, followed_by ) VALUES (?,?) ON DUPLICATE KEY UPDATE user_id = ? , followed_by = ?  ', [follow_id, user_id, user_id , follow_id] , (err, follower_result) =>{
                    if (!err) {
                        // console.log(following_result, follower_result);
                        return res.json({
                            status: true,
                            msg: 'Follow success',
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

//done
exports.unfollow = async (req, res) =>{

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
                            msg: 'Unfollow Success',
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

//done
exports.followrequestacpt = async (req, res) => {
    
    try {
        const body = req.body;
        const { user_id, following_to, status } = body
        console.log(body)
        // 'UPDATE follower SET status = ? WHERE following_to = ?, user_id = ?',

                sql.query('UPDATE following SET status = ? WHERE  user_id = ? AND following_to = ?', [status, user_id, following_to ] , (err, follower_result) =>{
                    if (!err) {


                        sql.query('UPDATE follower SET status = ? WHERE  user_id = ? AND followed_by = ?', [status, following_to, user_id ] , (err, follower_result) =>{
                            if (!err) {
                              return res.json({
                                status: true,
                                msg: 'Follow Request Accept',
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

exports.getfollowers = async (req, res) => {
    try {
        const body = req.body;
        const {user_id} = body
                sql.query('SELECT followed_by  FROM follower WHERE user_id = ? AND status = 1', [user_id] , (err, result) =>{
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