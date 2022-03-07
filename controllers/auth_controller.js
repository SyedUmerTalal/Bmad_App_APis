'user strict';
const sql = require('../connection');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const { authSchema } = require('../helper/validation_schema');
const config = require('./config');
// const { JSONParser } = require('formidable/parsers');
// const serviceID = "VA301e6c50c6ca9b8f2bb20ca5a61e443c";
// const accountSid = "AC579d3e39682aa9ef52ef5728d0d12707";
// const authToken = "fda3eb8440545dcbf591833cb72d6547";
const serviceID = "VAe824c39ca9715ad0925b6e72fb00d2ef";
const accountSid = "AC3120ccee4b1bcb655cbce140cb8d49ab";
const authToken = "ac5d8f40e862e7bca5030e91a7640d0f";
const client = require('twilio')(accountSid, authToken)
const allowedFileTypes = ['.mp4', '.mov', '.wmv', '.avi', '.jpeg', '.jpg', '.png', '.gif', '.mp3', '.wav', '.JPG'];
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: '@gmail.com',
        pass: 'password'
    }
});

const mailOptions = {
    from: 'minhalnadeem@gmail.com',
    to: 'vedepe5200@art2427.com',
    subject: 'Sending email',
    text: `Testing email`
};

//done
exports.userInfo = async (req, res) => {
    try {
        const body = req.query;
        const { user_id } = body
        sql.query('SELECT * FROM user WHERE user_id = ?', [user_id], (err, row) => {

            if (!err) {
                if(row[0].user_interest){
                    row[0].user_interest=JSON.parse(row[0].user_interest)
                }
                if(row[0].user_favorite){
                    row[0].user_favorite=JSON.parse(row[0].user_favorite)
                }
                if(row[0].user_gender_interest){
                    row[0].user_gender_interest=JSON.parse(row[0].user_gender_interest)
                }
                return res.json({
                    status: true,
                    msg: "Success",
                    data: row[0]
                })
            } else {
                return res.json({
                    status: false,
                    msg: "Fail",
                    data: []
                })
            }
        })

    } catch (e) {
        return res.json({
            status: false,
            msg: e,
            data: []
        })
    }
}

//done
exports.updateLocation = async (req, res) => {
    try {
        const body = req.body;
        const { user_id, user_longitude, user_latitude } = body
        console.log(user_longitude, user_latitude)
        sql.query('SELECT * FROM user WHERE user_id = ?',
            [user_id], (err, row) => {
                if (!err) {
                    if (row.length > 0) {

                        sql.query(`UPDATE user SET user_longitude = ?, user_latitude = ? WHERE user_id=${user_id}`, [
                            user_longitude,
                            user_latitude
                        ], (err, rows) => {
                            if (err) {
                                return res.json({
                                    status: false,
                                    msg: err,
                                    data: []
                                })
                            } else {
                                return res.json({
                                    status: true,
                                    msg: 'Location updated',
                                    data: {
                                        "Id": user_id
                                    }
                                })
                            }
                        }
                        )
                    }
                }

            }
        )
    }
    catch (err) {
        console.log(err)
        return res.send(err);
    }
}

exports.editProfile = async (req, res) => {

    var file_url, post_type = 'text';
    try {
        if (req.file == undefined) {
            //post without file
            file_url = "";     
        } else {
            //post with file
            const file_ext = path.extname(req.file.originalname);

            file_url = `http://https://600e-110-93-244-255.ngrok.io/post_file/${req.file.filename}`;

            if(!allowedFileTypes.includes(file_ext)){
                return res.json({
                    status: false,
                    msg: `${file_ext} File type not supported`,
                    data: []
                })
            } 

            // post_type = getPostType(file_ext);
        }


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

                     sql.query(`UPDATE user SET user_name = ?, user_bio = ?, user_title = ?,  user_address = ?, user_lives = ?, user_relation = ?, user_image = ? WHERE user_id=${user_id}`, [
                        user_name,
                        user_bio,
                        user_title,
                        user_address,
                        user_lives,
                        user_relation,
                        file_url

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
                                     "User_Images": file_url
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

//done
exports.register = async (req, res) => {

    try {
        const body = req.body;
        // checking if user exists against this email
        sql.query('SELECT * FROM user WHERE user_email = ?',
            [body.user_email], (err, row) => {
                if (!err) {

                    if (row.length > 0) {
                        //user already exists
                        return res.json({
                            status: false,
                            msg: "User already exists",
                            data: []
                        })
                    } else {
                        //user not exists 

                        const emailRegexp = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

                        if (emailRegexp.test(body.user_email)) {
                            sql.query('INSERT INTO user (user_name, user_email, user_password,user_contact,user_reg_verify_code,user_gender,user_gender_interest,user_interest,user_favorite,social_login) VALUES (?,?,?,?,?,?,?,?,?,?)', [
                                body.user_name,
                                body.user_email,
                                body.user_password,
                                body.user_contact,
                                body.user_reg_verify_code,
                                body.user_gender,
                                body.user_gender_interest,
                                body.user_interest,
                                body.user_favorite,
                                body.social_login
                            ], (err, rows) => {
                                if (err) {
                                    return res.json({
                                        status: false,
                                        msg: err,
                                        data: []
                                    })
                                }
                                else {
                                    // if(rows.length > 0){

                                    // }

                                    const token = jwt.sign({ password: rows.insertId }, 'todo-app-super-shared-secret');
                                    return res.json({
                                        status: true,
                                        msg: "User registered successfully",
                                        data: {
                                            "Id": rows.insertId,
                                            "Name": body.user_name,
                                            "Email": body.user_email,
                                            "Contact": body.user_contact,
                                            "Token": token
                                        }
                                    })
                                }
                            })
                        } else {
                            //email pattern wrong
                            return res.json({
                                status: false,
                                msg: "Invalid Email Address",
                                data: []
                            })
                        }
                    }

                } else {
                    res.send(err);
                }
            })
    } catch (e) {
        console.log('Catch an error: ', e)
        return res.json({
            status: false,
            msg: "Something went wrong",
            data: []
        })
    }
};

//done
exports.login = async (req, res) => {

    try {
        const body = req.body;
        console.log(body);
        //checking if user exists against this email
        sql.query('SELECT * FROM user WHERE user_email = ?', [body.email], (err, row) => {
            if (!err) {
               
                if (row[0] != undefined) {

                    //user exists match its email and password
                    // {
                    //     user_id: 16,
                    //     social_login: "['fb']",
                    //     user_name: 'Muhammad Ahsan Muneer',
                    //     user_email: 'ahsanmuneer@gmail.com',
                    //     user_password: 'ahsan12345',
                    //     user_address: 'R-659 15-A/4 Bufferzone',
                    //     user_contact: '+923488300016',
                    //     user_reg_verify_code: '4353',
                    //     user_status: 1,
                    //     user_created_at: 2021-06-08T17:20:30.000Z,
                    //     user_updated_at: 2021-06-08T17:20:30.000Z,
                    //     login_status: 0,
                    //     user_image: 'http://webprojectmockup.com:9448/post_file/post_file_1626429031651.png',
                    //     user_gender: 'male',
                    //     user_interest: "['tech', 'art_design', 'animals']",
                    //     user_favorite: "['tang', 'rohabza']",
                    //     user_gender_interest: '',
                    //     user_longitude: '67.0665601',
                    //     user_latitude: '24.7931192',
                    //     user_title: 'Software Engineer',
                    //     user_bio: 'stfu stfu stfu stfu stfustfustfustfustfustfustfustfustfustfustfu',
                    //     user_lives: 'Karachi',
                    //     user_coverImage: 'http://webprojectmockup.com:9448/post_file/post_file_1626429031651.png',
                    //     user_relation: 'Single'
                    //   }
                    const id = row[0].user_id;
                    const email = row[0].user_email;
                    const user_name = row[0].user_name;
                    const password = row[0].user_password;

                    if (email == body.email && password == body.password) {
                        console.log("andr agaya")
                        const token = jwt.sign({ password: id }, 'todo-app-super-shared-secret');
                        return res.json({
                            status: true,
                            msg: "Login Successful",
                            data: {
                                id,
                                user_name,
                                token
                            }
                        })

                    } else {
                        console.log("Bad credentials")
                        return res.json({
                            status: false,
                            msg: "Bad credentials",
                            data: []
                        })
                    }

                } else {
                    console.log("User not found")
                    //user not exists
                    return res.json({
                        status: false,
                        msg: "User not found",
                        data: []
                    })
                }

            } else {
                console.log("User not found",err)
                return res.send(err);
            }
        })
    } catch (e) {
        console.log('Catch an error: ', e)
    }
};


//done
exports.otp = async (req, res) => {
    console.log("API HIT", req.query.phonenumber, req.query.channel)
    try {
        if (req.query.phonenumber) {
            client
                .verify
                .services(serviceID)
                .verifications
                .create({
                    to: `+${req.query.phonenumber}`,
                    channel: req.query.channel === 'call' ? 'call' : 'sms'
                })
                .then(data => {
                    res.status(200).send({
                        message: "Verification is sent!!",
                        phonenumber: req.query.phonenumber,
                        data
                    })
                }).catch((err)=>{
                    res.status(400).send({
                        message: err,
                    })
                })
        } else {
            res.status(400).send({
                message: "Wrong phone number :(",
                phonenumber: req.query.phonenumber,
                data
            })
        }
    }
    catch (err) {
        // console.log(err, "error")
        res.status(400).send({
            message: err,
        })
    }
}

//done
// Verify Endpoint
exports.verify = async (req, res) => {
    if (req.query.phonenumber && (req.query.code).length === 4) {
        client
            .verify
            .services(serviceID)
            .verificationChecks
            .create({
                to: `+${req.query.phonenumber}`,
                code: req.query.code
            })
            .then(data => {
                if (data.status === "approved") {
                    res.status(200).send({
                        message: "User is Verified!!",
                        data
                    })
                }
            })
    } else {
        res.status(400).send({
            message: "Wrong phone number or code :(",
            phonenumber: req.query.phonenumber,
            data
        })
    }
}


// exports.updateUser = async (req, res) =>{

//     try {
//         const { user_name, user_contact, user_address, user_id } = req.body;
        
//         if (req.fileValidationError) {
//             return res.json({
//                 status: false,
//                 msg: 'Upload valid file'
//             }) 
//        }

//         let image = req.file;

//         let query = 'UPDATE user SET user_name = ?, user_contact = ?, user_address = ? WHERE user_id = ?'
//         let queryValues = [user_name, user_contact, user_address, user_id]

//         if (image) {
//             query = 'UPDATE user SET user_name = ?, user_contact = ? , user_address = ?, user_image = ? WHERE user_id = ?'
//             queryValues = [user_name, user_contact, user_address, image.path, user_id]
//         }
        

//         sql.query(query, queryValues, (err, result) =>{
//             if (!err) {
//                 return res.json({
//                     status: true,
//                     msg: 'User updated successfully'
//                 })
//             } else{
//                 return res.send(err);
//             }
//         })

//     } catch(e) {
//         console.log('Catch an error: ', e);
//         return res.json({
//             status: false,
//             msg: 'Something went wrong'
//         }) 
//     }

// }
