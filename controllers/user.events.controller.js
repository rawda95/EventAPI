const mongoose = require('mongoose');
require('../Models/event');
require('../Models/user');
Role = require('../_helpers/role'),
    require('../Models/user.events');

const EventModel = mongoose.model('Event'),
    UserEventsModel = mongoose.model("UserEvents"),
    UserModel = mongoose.model('User');




const assignUser = async(req, res, next) => {


    let ErrorList = [],
        IsValid = true;
    if (!req.body.user) {
        IsValid = false;
        ErrorList.push('The user filed is required.');

    }
    if (!req.body.event) {
        IsValid = false;
        ErrorList.push('The event filed is required.');

    } else if (!mongoose.Types.ObjectId.isValid(req.body.event)) {
        IsValid = false;
        ErrorList.push('Invalid event id.');
    }



    if (!IsValid) {
        res.status(400).send({
            error: ErrorList

        });
    }


    try {
        var user = await UserModel.findById(req.body.user);
        var event = await EventModel.findById(req.body.event);

        if (!user) {
            res.status(400).send({
                message: `cant find user with this id ${req.body.user}`
            });

        }
        if (!event) {
            res.status(400).send({
                message: `cant find event with this id ${req.body.event}`
            });

        }
        //scheck if user added to this event before
        let IsRegiterbefore = await UserEventsModel.find({ user: user, event: event });
        if (IsRegiterbefore.length !== 0) {
            return res.status(400).send({
                message: `this user added to this event before`
            });
        }

        let Userevent = new UserEventsModel({
            user: user,
            event: event
        });
        try {
            Userevent.save();

            res.status(201).send({
                user: {
                    username: user.username,
                    id: user.id
                },
                event: {
                    Title: event.Title,
                    id: event._id,
                    date: event.Date
                }

            });

        } catch (addError) {
            res.status(400).send({

                message: addError.message,

            });
        }

    } catch (error) {
        res.status(400).send({
            message: error.message
        });
    }

};


const userEvents = async(req, res, next) => {


    let ErrorList = [],
        IsValid = true;
    if (!req.params.id) {
        IsValid = false;
        ErrorList.push('The user filed is required.');

    }




    if (!IsValid) {
        res.status(400).send({
            error: ErrorList

        });
    }


    try {
        var user = await UserModel.findById(req.params.id);


        if (!user) {
            res.status(400).send({
                message: `cant find user with this id ${req.params.id}`
            });

        }



    } catch (error) {
        res.status(400).send({
            message: error.message
        });
    }

    try {

        // let userEvents = UserEventsModel.find(ue => ue.user === user).populate({
        //     path: "event"
        // })


        let userEvents = await UserEventsModel.find({
                user: user,

            }).select('event -_id')
            .populate({
                path: "event",
            }).select('event');

        if (!userEvents) {
            res.status(400).send({
                message: `cant find events for the user with id : ${req.params.id}`
            });
        }

        return (res.send(userEvents));

    } catch (addError) {
        res.status(400).send({

            message: addError.message,

        });
    }
};





const eventUsers = async(req, res, next) => {


    let ErrorList = [],
        IsValid = true;
    if (!req.params.id) {
        IsValid = false;
        ErrorList.push('The event filed is required.');


    } else if (mongoose.Types.ObjectId.isValid(req.body.event)) {
        IsValid = false;
        ErrorList.push('Invalid event id.');
    }



    if (!IsValid) {
        res.status(400).send({
            error: ErrorList

        });
    }


    try {
        var event = await EventModel.findOne({ _id: req.params.id });
        if (!event) {
            res.status(400).send({
                message: `cant find event with this id ${req.params.id}`
            });

        }



    } catch (error) {
        res.status(400).send({
            message: error.message
        });
    }

    try {

        // let EventUsers = UserEventsModel.find(ue => ue.event === event).populate({
        //     path: "user"
        // })




        let EventUsers = await UserEventsModel.find({
                event: event,

            }).select('user -_id')
            .populate({
                path: "user",
            }).select('user');




        if (!EventUsers) {
            res.status(400).send({
                message: `cant find users for the event with id : ${req.params.event}`
            });
        }

        return (res.send(EventUsers));

    } catch (addError) {
        res.status(400).send({

            message: addError.message,

        });
    }
};






const userUpcomingEvents = async(req, res, next) => {

    try {

        var user = await UserModel.findById(req.user);
        if (user.role !== Role.User) {
            res.status(400).send({
                message: `  ${req.user} cant have any events`
            });
        }
        let userEvents = await UserEventsModel.find({
                user: user,
                // Date: { $gte: new Date() }
            }).select('event -_id')
            .populate({
                path: "event",
                match: { Date: { $gte: new Date() } },

                select: ['Title', 'Body',
                    'Date'
                ]
            }).select('event');
        if (userEvents[0].event === null) {
            return res.send([]);

        }
        if (!userEvents) {
            res.status(400).send({
                message: `cant find events for the user with id : ${req.body.user}`
            });
        }


        return res.send(userEvents);

    } catch (addError) {
        res.status(400).send({

            message: addError.message,

        });
    }
};




const userPastEvents = async(req, res, next) => {

    try {
        if (req.user.role != Role.User) {
            res.status(400).send({
                message: `  ${req.user.role} cant have any events`
            });
        }
        var user = await UserModel.findById(req.user);


        let userEvents = await UserEventsModel.find({
                user: user,

            }).select('event -_id')
            .populate({
                path: "event",
                match: { Date: { $lt: new Date() } },

                select: ['Title', 'Body',
                    'Date'
                ]
            }).select('event');
        if (userEvents[0].event === null) {
            return res.send([]);

        }

        if (!userEvents) {
            res.status(400).send({
                message: `cant find events for the user with id : ${req.body.user}`
            });
        }

        return res.send(userEvents);

    } catch (addError) {
        res.status(400).send({

            message: addError.message,

        });
    }
};




const UserRegisterToEvent = async(req, res, next) => {


    let ErrorList = [],
        IsValid = true;

    if (!req.body.event) {
        IsValid = false;
        ErrorList.push('The event filed is required.');

    } else if (!mongoose.Types.ObjectId.isValid(req.body.event)) {
        IsValid = false;
        ErrorList.push('Invalid event id.');
    }


    if (!IsValid) {
        res.status(400).send({
            error: ErrorList

        });
    }


    try {
        var user = await UserModel.findById(req.user);
        var event = await EventModel.findById(req.body.event);
        if (!event) {
            res.status(400).send({
                message: `cant find event with this id ${req.body.event}`
            });

        }
        //scheck if user added to this event before
        IsRegiterbefore = await UserEventsModel.find({ user: user, event: event });
        if (IsRegiterbefore.length !== 0) {
            return res.status(400).send({
                message: `this user added to this event before`
            });
        }

        let Userevent = new UserEventsModel({
            user: user,
            event: event
        });
        try {
            Userevent.save();

            res.status(201).send({
                user: {
                    username: user.username,
                    id: user.id
                },
                event: {
                    Title: event.Title,
                    id: event._id,
                    date: event.Date
                }

            });

        } catch (addError) {
            res.status(400).send({

                message: addError.message,

            });
        }

    } catch (error) {
        res.status(400).send({
            message: error.message
        });
    }

};



const cancelUserRegistration = async(req, res, next) => {


    let ErrorList = [],
        IsValid = true;

    if (!req.body.event) {
        IsValid = false;
        ErrorList.push('The event filed is required.');

    } else if (!mongoose.Types.ObjectId.isValid(req.body.event)) {
        IsValid = false;
        ErrorList.push('Invalid event id.');
    }


    if (!IsValid) {
        res.status(400).send({
            error: ErrorList

        });
    }


    try {

        var user = await UserModel.findById(req.user);
        var event = await EventModel.findById(req.body.event);
        if (!event) {
            res.status(400).send({
                message: `cant find event with this id ${req.body.event}`
            });

        }

        await UserEventsModel.findOneAndDelete({ user: user, event: event });
        res.status(201).send({
            message: "deleted successfully"
        });

    } catch (deleteError) {
        res.status(400).send({

            message: deleteError.message,

        });
    }
};


module.exports = {
    assignUser,
    userEvents,
    eventUsers,
    userUpcomingEvents,
    userPastEvents,
    UserRegisterToEvent,
    cancelUserRegistration

};