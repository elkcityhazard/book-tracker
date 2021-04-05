const mongoose = require('mongoose');
const {isNumeric, isLength} = require('validator');

function checkLength (value) {
    if (value.length === 10) {
        return true
    } else if (value.length === 13) {
        return true
    } else {
        return false;
    }
}

const bookSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,        
    },
    author: {
        type: String,
        required: true,
        trim: true,
        lowercase: true
    },
    price: {
        type: Number,
        required: true,
    },
    ISBN: {
        type: String,
        required: true,
        minLength: 10,
        maxLength: 13,
        validate: [checkLength, 'Length is Incorrect']
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    }
}, {
    timestamps: true
})

const Book = mongoose.model('Book', bookSchema);

module.exports = Book;