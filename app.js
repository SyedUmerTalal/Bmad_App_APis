const express = require('express');
const bodyParser = require('body-parser');
const route = require('./routes/route');
const app = express();

app.use('/post_file', express.static('upload/post_media'));

app.use(bodyParser.json({ limit: '10mb', extended: true }));
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));

app.use('/api', route);

app.listen(5000, () => console.log('Listening to port 5000...'));