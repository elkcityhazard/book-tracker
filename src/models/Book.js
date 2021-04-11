const mongoose = require('mongoose');
const {isNumeric, isLength} = require('validator');

const checkLength = (value) => {
    if (!value.length === 10 || !value.length === 13) {
        console.log('value:', value.length)
        throw new Error('Length is incorrect')
    }
}

const bookSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'title is required'],
        trim: true,        
    },
    author: {
        type: String,
        required: [true, 'author required'],
        trim: true,
        lowercase: true
    },
    price: {
        type: Number,
        required: [true, 'price is required']

    },
    ISBN: {
        type: String,
        required: [true, 'ISBN required'],
        minLength: [10, 'Must be 10 or 13 characters'],
        maxLength: [13, 'Must be 10 or 13 characters'],
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