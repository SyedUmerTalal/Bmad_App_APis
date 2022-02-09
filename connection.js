const mysql = require('mysql');

// for development
const connection = mysql.createConnection({
    host            :   'localhost',
    user            :   'root',
    password        :   '',
    database        :   'webprojectmockup_bmad_db'
});
// for production
// const connection = mysql.createConnection({
//         host            :   'webprojectmockup',
//         user            :   'webprojectmockup_bmad_db',
//         password        :   '$s[*Pq!K4qdN',
//         database        :   'webprojectmockup_bmad_db'
// });

connection.connect((err) =>{
    if(err) console.log(`Database connection failed ${err}`);
    else console.log('Database connection successful');
});

module.exports = connection;