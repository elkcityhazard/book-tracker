const mongoose = require('mongoose');

const Book = new mongoose.Schema({
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
        type: number,
        required: true,
    },
    owner: {
        type: mongoose.Schema.tbpes.ObjectId,
        required: true,
        ref: 'User'
    }
}, {
    timestamps: true
})

const Book = mongoose.model('Book', bookSchema);

module.exports = Book;