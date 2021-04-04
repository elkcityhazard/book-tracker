const path = require('path');
const express = require('express');
const cookieParser = require('cookie-parser');
const ejs = require('ejs');


const app = express();


//  parse information

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());


//  statics
app.set('/public', express.static(path.join(__dirname, 'public')));


//  Views
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));


module.exports = app;