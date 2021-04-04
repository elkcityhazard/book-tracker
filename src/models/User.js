const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const {isEmail} = require('validator'); 

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, 'Please enter an email'],
        unique: true,
        trim: true,
        lowercase: true,
        validate: [isEmail, 'Email format is invalid']

    },
    password: {
        type: String,
        required: [true, 'please enter a password'],
        trim: true,
        minLength: [7, 'Password must be longer than 7 characters'],

    }
})

//  Virtual for Books

userSchema.virtual('books', {
    ref: 'Book',
    localField: '_id',
    foreignField: 'owner'
})

//  Salt and Hash The Password For Storage

userSchema.pre('save', async function(next) {
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt);
    next();
})

userSchema.pre('remove', async function (next) {
    await Task.deleteMany({owner: this._id});
    next();
})


//  static method to login the user

userSchema.statics.login = async function (email, password) {
    const user = await User.findOne( {email });

    if (user) {
        const auth = await bcrypt.compare(password, user.password);
        if (auth) {
            return user;
        }
        throw Error('incorrect password');
    }
    throw Error('incorrect email')
}

const User = mongoose.model('User', userSchema);

module.exports = User;