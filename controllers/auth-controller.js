const passport = require('passport');

const CLIENT_URL = "http://localhost:3000/";

const login = (req, res) => {
    if(req.user){
        res.status(200).json({
            success: true,
            message: 'success',
            user: req.user,
            cookies: req.cookies
        });
    } else {
        res.status(401).json({
            success: false,
            message: 'unauthorized'
        });
    }
}

const logout = (req, res) => {
    req.logout((err) => {
        if (err) { return next(err); }
        res.redirect(CLIENT_URL);
    });
}

const loginFailed = (req, res) => {
    res.status(401).json({
        success: false,
        message: 'unauthorized'
    });
}

const googleAuth = passport.authenticate('google', { scope: ['profile'] });

const googleAuthCallback = passport.authenticate('google', {
    successRedirect: CLIENT_URL,
    failureRedirect: '/login/failed'
});

module.exports = { login, logout, googleAuth, googleAuthCallback, loginFailed };