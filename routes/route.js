const express = require('express');
const app =  express();

var authRoute = require('./authentication');
var postRoute = require('./post');
var userRoute = require('./user');

app.use('/auth', authRoute);
app.use('/post', postRoute);
app.use('/user', userRoute);

module.exports = app;