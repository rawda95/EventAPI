const mongoose = require('mongoose'),
    passport = require('passport'),
    jwt = require('jsonwebtoken'),
    authorize = require('../_helpers/authorize'),
    Role = require('../_helpers/role');
require('../Models/user');


const UserModel = require('../Models/user');


const Create = async(req, res, next) => {
    // input validation 
    let username = req.body.username,
        password = req.body.password,
        Email = req.body.Email;

    let ErrorList = [],
        IsError = false;

    if (!username) {

        ErrorList.push(' username is required.');
        IsError = true;
    }
    if (!password) {

        ErrorList.push(' password is required.');
        IsError = true;
    }
    if (!Email) {
        ErrorList.push(' Email is required');
        IsError = true;
    } else {
        const regEmail = /\S+@\S+\.\S+/;
        IsEmailValid = regEmail.test(Email);
        if (!IsEmailValid) {
            if (!IsError) {
                IsError = true;
            }

            ErrorList.push("Invalid email address.");
        } else {
            try {
                const Emailxist = await UserModel.findOne({ Email });
                if (Emailxist) {
                    ErrorList.push('This email address is already used by another contact.');
                    IsError = true;
                }
            } catch (error) {
                res.status(400).send({
                    message: error.message
                });
            }

        }
    }



    if (IsError) {
        res.status(400).send({
            error: ErrorList

        });
    }

    try {
        passport.authenticate('signup', { session: false }, async(err, user, info) => {
            if (err) {
                return res.status(400).send({
                    error: err
                });

            } else {

                user.role = Role.Admin;
                user.Email = Email;
                try {
                    await user.save();

                } catch (error) {
                    res.status(400).send({
                        error: error
                    });
                }

                res.status(201).send({
                    user: {
                        username: user.username,
                        id: user._id,
                        Email: user.Email,

                    }
                });
            }
        })(req, res, next);
    } catch (err) {
        res.status(500).send({
            error: err.message
        });

    }
};





const remove = async(req, res) => {

    let id = req.params.id;
    if (isNaN(id)) {
        return res.status(400).send({
            message: 'Id must be a number'
        });
    }

    try {
        user = await UserModel.findByIdAndRemove(id);
        res.send({
            message: 'The user deleted successfully !'
        });

    } catch (error) {
        if (error.kind === 'ObjectId' || error.name == 'NotFound') {
            return res.status(404).send({
                message: `Cant find Admin with this  id ${req.params.id}`
            });

        }
        return res.status(500).send({
            message: `an error occurred during deleting the Admin with id:${id} please try again later`
        });
    }

};






module.exports = {
    Create,
    remove
};