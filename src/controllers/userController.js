const User = require('../models/User');
const jwt = require('jsonwebtoken');
const validator = require('validator');

//  Create a JSON Web Token
const maxAge = 3 * 24 * 60 * 60;
const createToken = (id) => {
    return jwt.sign({id}, process.env.JWT_SECRET, {
        expiresIn: maxAge,
    })
}

const handleErrors = (err) => {
    
    let errors = { email: '', password: ''};

    if (err.errors['email'].message === 'Please enter an email') {
        errors.email = err.errors['email'].message;
    }

    if (err.errors['password'].message === 'Please enter an email') {
        errors.email = err.errors['email'].message;
    }

    //  incorrect email
    if (err.message === 'incorrect email') {
        errors.email = 'That email is not registered'
    }

    //  incorrect password
    if (err.message === 'incorrect password') {
        errors.password = 'That password is incorrect'
    }

    //  duplicate email error
    if (err.code === 11000) {
        errors.email = 'That email is already registered'
        return errors;
    }

    //  validation errors
    if (err.message.includes('User validation failed')) {
        Object.values(err.errors).forEach(({ properties }) => {
            console.log('Val:', val);
            console.log('Properties:', properties);
            errors[properties.path] = properties.message;
        })
    }
    return errors;
}

exports.signup_post = async (req, res) => {
    let { email, password} = req.body;
    let errors = {
        email: '',
        password: ''
    }
    email = validator.escape(email);
    password = validator.escape(password);

    if (!email) {
        errors.email = 'email cannot be empty'
    }
    if (!password) {
        errors.password = 'password cannot be empty'
    }
    if (!email || !password) {
        return res.status(500).json({
            errors
        })
    }

    if (!validator.isEmail(email)) {
        return res.status(500).json({
            errors
        })
    }

    
    try {
        const user = await User.create({email, password});
        const token = createToken(user._id);
        res.cookie('jwt', token, {httpOnly: true, maxAge: maxAge * 1000});
        res.status(201).json({
            user: user._id,
            token: token
        })
    } catch (err) {
        const errors = handleErrors(err);
        return res.status(400).json({
            errors
        })
    }
}



exports.login_post = async (req, res) => {
    let { email, password } = req.body;
    email = validator.escape(email);
    password = validator.escape(password);
    if (!validator.isEmail(email)) {
        return res.status(500).json({
            errors: {
                email: 'Invalid email format'
            }
        })
    }
    if (!password) {
        return res.status(500).json({
            errors: {
                password: 'Please enter a password'
            }
        })
    }
    try {
        const user = await User.login(email, password)
        const token = createToken(user._id);
        res.cookie('jwt', token, {httpOnly: true, maxAge: maxAge * 1000});
        res.status(200).json( {
            user: user._id,
            token: token
        })

    } catch (err) {
        const errors = handleErrors(err);
        res.status(400).json({
            errors
        })
    }

}

exports.login_patch = async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ['password'];
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update));

    if (!isValidOperation) {
        return res.status(400).send({
            error: 'Invalid Updates'
        })
    }

    try {
        // console.log(req.user);
        updates.forEach((update) => req.user[update] = req.body[update]);
        await req.user.save();
        res.status(200).json({
            user: req.user
        })

    } catch (err) {
        const errors = handleErrors(err);
        return res.status(400).json({
            errors
        })
    }
}

exports.login_delete = async (req, res) => {
    const user = await User.findById(req.user.id);
    await user.remove();
    res.cookie('jwt', '', {maxAge: 1});
    res.redirect('/')
}

