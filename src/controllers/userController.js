const User = require('../models/User');
const jwt = require('jsonwebtoken');

//  Create a JSON Web Token
const maxAge = 3 * 24 * 60 * 60;
const createToken = (id) => {
    return jwt.sign({id}, process.env.JWT_SECRET, {
        expiresIn: maxAge,
    })
}

const handleErrors = (err) => {
    console.log(err.message, err.code);
    let errors = { email: '', password: ''};

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
    if (err.message.includes('user validation failed')) {
        console.log(err);
        Object.values(err.errors).forEach(({ property }) => {
            console.log('Val:', val);
            console.log('Properties:', properties);
            errors[properties.path] = prperties.message;
        })
    }
    return errors;
}

exports.signup_post = async (req, res) => {
    const { email, password} = req.body;
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
    const { email, password } = req.body;
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

exports.logout_get = async (req, res) => {
    res.cookie('jwt', '', {maxAge: 1});
    res.redirect('/')

}