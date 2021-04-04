const path = require('path');
const express = require('express');
const cookieParser = require('cookie-parser');
const ejs = require('ejs');
const userRoutes = require('./routes/userRoutes')
const {requireAuth, checkUser} = require('./utils/auth');

const app = express();


//  parse information

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());


//  statics
app.use('/public', express.static(path.join(__dirname, 'public')));


//  Views
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use('*', checkUser)

app.use('/', userRoutes);

app.get('/my-products', requireAuth, (req, res) => {
    try {
        return console.log('authenticated')
    } catch (err) {
        return console.log(err.message)
    }

})


module.exports = app;