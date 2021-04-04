exports.signup_get = async (req, res) => {
    res.locals.user = null
res.render('signup', {
    pageTitle: 'Sign Up Today'
})
}

exports.signup_post = async (req, res) => {

}

exports.login_get = async (req, res) => {

}

exports.login_post = async (req, res) => {

}

exports.logout_get = async (req, res) => {

}