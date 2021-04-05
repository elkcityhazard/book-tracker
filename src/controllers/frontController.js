const Books = require('../models/Book');

exports.homePage_get = async (req, res) => {
    res.render('home', {
        pageTitle: 'Book Log',
        path: '/'
    })
}

exports.signup_get = async (req, res) => {
  res.render('signup', {
    pageTitle: 'Sign Up For Book App',
    path: '/'
  });
};
exports.login_get = async (req, res) => {
  res.render('login', {
    pageTitle: 'Login To Book App',
    path: '/login'
  })
};

exports.logout_get = async (req, res) => {
  res.cookie('jwt', '', {maxAge: 1});
  res.redirect('/')

}

exports.editAllBooks_get = async (req, res) => {
  const id = req.id;
  const books = await Books.find({owner: id});
  res.status(200).render('edit-books', {
    pageTitle: 'Edit Books',
    books: books
  })

}

