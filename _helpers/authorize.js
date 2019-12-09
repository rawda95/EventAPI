const UserModel = require('../Models/user');
const Role = require('./role');
module.exports = authorize;

function authorize(roles = []) {
    console.log('in authorize function');
    // roles param can be a single role string (e.g. Role.User or 'User') 
    // or an array of roles (e.g. [Role.Admin, Role.User] or ['Admin', 'User'])
    if (typeof roles === 'string') {
        roles = [roles];
    }


    // if (roles.length) {
    //     // if (roles.length && !roles.includes(req.user.role)) {
    //     return { status: 401, message: 'Unauthorized' };
    // } else
    //     return { status: 401, message: 'ok' };

    return [

        // authorize based on user role
        async(req, res, next) => {

            if (!req.user) {
                return res.status(400).send({
                    message: 'authentication error'
                });
            }
            let username = req.user.username;
            const dbUser = await UserModel.findOne({ username });
            // update 

            req.user.role = dbUser.role;


            // console.log(dbUser);
            // console.log(username);
            // console.log(dbUser);


            if (roles.length && !roles.includes(req.user.role)) {

                // user's role is not authorized
                return res.status(401).json({ message: 'Unauthorized' });
            } else {
                // res.status(400).send({
                //     messgae: 'blablablbalba',
                // });
                // // authentication and authorization successful
                next();
            }
        }
    ];
}