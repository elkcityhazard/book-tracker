const User = require('../models/User');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv').config();

const requireAuth = (req, res, next) => {
    const token = req.cookies.jwt;

    if (token) {
        jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            if (err) {
                console.log(err.message);
                res.redirect('/login');
            }
            else {
                console.log('Decoded Token.id From requireAuth: ', decoded.id);
                next();
            }
        })
    } else {
        res.redirect('/login')
    }
}

const checkUser = (req, res, next) => {
    const token = req.cookies.jwt;

    if (token) {
        jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
            if (err) {
                console.log('error message from checkUser:', err.message);
                res.locals.user = null;
                next();
            } else {
                let user = await User.findById(decoded.id);
                req.id = decoded.id;
                res.locals.user = user;
                req.user = user;
                next();
            }
        })
    } else {
        res.locals.user = null;
        next();
    }
}


module.exports = {requireAuth, checkUser}