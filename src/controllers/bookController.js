const Book = require('../models/Book');

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
        res.status(200).json({
            book
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
        const allowedUpdates = ['title', 'author', 'price'];
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
        res.status(400).json({
            msg: err.message
        })
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