exports.homePage_get = async (req, res) => {
    res.render('home', {
        pageTitle: 'Book Log',
        path: '/'
    })
}

exports.signup_get = async (req, res) => {
  res.render('signup', {
    pageTitle: 'Sign Up Today',
  });
};
exports.login_get = async (req, res) => {};

