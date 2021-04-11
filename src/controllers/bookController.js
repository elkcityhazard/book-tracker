const Book = require('../models/Book');


const handleErrors = (err) => {
    console.log(err.name, err.message, err.code, err.errors)
    let errors = {
        title: '',
        author: '',
        price: '',
        ISBN: ''
    }

    // Cast Errors
    if (err.name === 'ValidationError') {
        throw new Error(`${err.path} : ${err.value}`)
    }

    //  title empty
    if (err.message === 'title is required') {
        errors.title = 'Please enter a title';
    }

    //  author empty

    if (err.message === 'author required') {
        errors.author = 'Please Enter An Author'
    }

    // Price
    if (err.message === 'price is required') {
        errors.price = 'Please enter a price'
    }

     
    //  book validation
    if (err.message.includes('Book validation failed')) {
        Object.values(err.errors).forEach(({ properties }) => {
             console.log('Val:', val);
             console.log('Properties:', properties);
            errors[properties.path] = properties.message;
            
        })
    }


    
console.log('handleErrors: ', errors);
}

exports.addNewBook_post = async (req, res) => {
    const owner = req.user.id;
    const {author, title, price, ISBN} = req.body;
    try {
        const book = await Book.create({author, title, price, ISBN, owner});
        res.status(200).json({
            book
        })
    } catch (err) {
        return res.status(400).json({
            msg: err.message
        })
    }
}

exports.getAllBooks_get = async (req, res) => {
    const match = {};
    const sort = {};

    if (req.query.completed) {
        match.completed = req.query.completed === 'true';
    }

    if (req.query.sortBy) {
        const parts = req.query.sortBy.split(':');
        sorts[parts[0]] = parts[i] === 'desc' ? -1 : 1
    }
    console.log(req.id);
    try {
        await req.user.populate({
            path: 'books',
            match,
            options: {
                limit: parseInt(req.query.limit),
                skip: parseInt(req.query.skip),
                sort
            }
        }).execPopulate();
        res.send(req.user.books);
            } catch (err) {
        return res.status(400).json({
            msg: err.message
        })
    }
}

exports.getSingleBook_get = async (req, res) => {
    const edit = req.query.edit;
    try {
        const book = await Book.findOne({
            _id: req.params.id,
            owner: req.id
        })

        if (!book) {
            return res.status(404).json({
                msg: `Book Could Not Be Located`
            })
        }
        res.status(200).render('singleBook', {
            pageTitle: book.title,
            book: book,
            edit: edit
            
        })

    } catch (err) {
        return res.status(400).json({
            msg: err.message
        })
    }
}

exports.updateSingleBook_patch = async (req, res) => {
    try {
        const id = Object.values(req.params);
        const updates = Object.keys(req.body);
        const allowedUpdates = ['title', 'author', 'price', 'ISBN'];
        const isValidOperation = updates.every(update => allowedUpdates.includes(update));

        if (!isValidOperation) {
            return res.status(405).json({
                msg: 'Update is invalid!'
            })
        }
        const book = await Book.findOne({_id: id, owner: req.id});
        updates.forEach((update) => book[update] = req.body[update]);
        await book.save();
        res.status(200).json({
           book
        })

    } catch (err) {
        const errors = handleErrors(err);
        return;
    }
}

exports.deleteSingleBook_delete = async (req, res) => {
    const id = Object.values(req.params);
    const book = await Book.findOneAndDelete({_id: id, owner: req.id})
    if (!book) {
        return res.status(404).json({
            msg: 'Book Not Found'
        })
    }
    res.status(200).json({
        status: 'removed',
        book
    })
}