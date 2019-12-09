const express = require('express'),
    passport = require('passport'),
    jwt = require('jsonwebtoken');





const router = express.Router();



router.post('/login', async(req, res, next) => {

    if (!req.body.username) {
        return res.status(500).send({
            message: "username is required"
        });

    }
    if (!req.body.password) {

        return res.status(500).send({
            message: "password is required"
        });
    }


    try {

        passport.authenticate('login', async(err, user, info) => {
            try {
                if (err || !user) {
                    return res.status(400).send({
                        message: info
                    });
                }
                req.login(user, { session: false }, async(error) => {
                    if (error) return next(error);
                    //user password in the token so we pick only the email and id
                    const body = { _id: user._id, username: user.username };
                    //Sign the JWT token and populate the payload with the user email and id
                    const token = jwt.sign({ user: body }, 'top_secret', { expiresIn: '30m' });
                    //Send back the token to the user
                    return res.json({ token });
                });
            } catch (error) {
                return res.status(400).send({
                    message: error.message
                });
            }
        })(req, res, next);
    } catch (err) {
        return res.status(500).send({
            message: err.message
        });
    }
});



module.exports = router;