const passport = require('passport'),
    localStrategy = require('passport-local').Strategy,
    UserModel = require('../Models/user'),
    JWTstrategy = require('passport-jwt').Strategy,
    ExtractJWT = require('passport-jwt').ExtractJwt,
    mongoose = require('mongoose');



passport.use('signup', new localStrategy({

    usernameField: 'username',
    passwordField: 'password'
}, async(username, password, done) => {
    try {
        const usernameExist = await UserModel.findOne({ username });
        if (usernameExist) {
            return done('username uesd');
        }
        const user = await UserModel.create({ username, password });
        console.log(user);
        return done(null, user);

    } catch (error) {
        done(error);
    }
}));



passport.use('login', new localStrategy({
    usernameField: 'username',
    passwordField: 'password'
}, async(username, password, done) => {
    try {
        const user = await UserModel.findOne({ username });
        if (!user) {
            return done(null, false, { message: 'User not Found' });
        }
        const validate = await user.isValidPassword(password);
        if (!validate) {
            return done(null, false, { message: 'Wrong Password' });
        }
        return done(null, user, { message: 'Logged in Successfully' });

    } catch (error) {
        return done(null, false, { message: error });
    }
}));



passport.deserializeUser(async function(id, done) {


    const user = await UserModel.findOne({ id });
    console.log(user);

    getUser(id).then(function(ReqUser) {

        ReqUser.role = user.role;
        console.log(ReqUser.role);
        return done(null, user);
    });
});


passport.use(new JWTstrategy({
    secretOrKey: 'top_secret',
    jwtFromRequest: ExtractJWT.fromUrlQueryParameter('token')
}, async(token, done) => {
    try {
        return done(null, token.user);
    } catch (error) {
        done(error);
    }
}));