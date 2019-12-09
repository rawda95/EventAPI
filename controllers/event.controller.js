const mongoose = require('mongoose');
require('../Models/event');
require('../Models/user');

const EventModel = mongoose.model('Event'),
    UserModel = mongoose.model('User');




const Create = async(req, res, next) => {

    let title = req.body.title,
        body = req.body.body,
        date = new Date(req.body.date);

    let ErrorList = [],
        IsValid = true;
    if (!title) {
        IsValid = false;
        ErrorList.push('The Title filed is required.');

    }
    if (!body) {
        IsValid = false;
        ErrorList.push('The body filed is required.');

    }

    if (!date) {


        IsValid = false;
        ErrorList.push('The Date filed is required.');

    } else {
        if ((typeof date.getMonth !== 'function')) {

            IsValid = false;
            ErrorList.push('Invalid Date.');

        }

    }

    if (!IsValid) {
        res.status(400).send({
            error: ErrorList

        });
    }

    let event = new EventModel({
        Title: title,
        Body: body,
        Date: date,
        // Creator: req.user,
    });

    try {
        await event.save();
        res.status(201).send({
            event: {
                title: event.Title,
                body: event.Body,
                id: event._id,
                date: event.Date
            }
        });
    } catch (saveError) {
        res.status(400).send({

            message: saveError.message,

        });
    }


};



const UpcomingEvents = async(req, res) => {

    try {
        let events = await EventModel.find({
            "Date": { "$gte": new Date() }
        });
        res.send(events);

    } catch (error) {

        res.status(500).send({
            message: 'An error occurred please try again later. ',
            error: error.message
        });
    }
}


const PastEvents = async(req, res) => {

    try {
        let events = await EventModel.find({
            "Date": { "$lt": new Date() }
        });
        res.send(events);

    } catch (error) {

        res.status(500).send({
            message: 'An error occurred please try again later. ',
            error: error.message
        });
    }
}




const Update = async(req, res, next) => {

    if (!req.body) {
        return res.status(400).send({
            message: 'Event content can not be empty'
        });
    }
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).send({
            message: 'Invalid event id.'
        });
    }

    let title = req.body.title,
        body = req.body.body,
        date = req.body.date;


    let UpdateEnvet = {}
    if (title) {
        UpdateEnvet.Title = title;
    }
    if (body) {
        UpdateEnvet.Body = body;
    }
    if (date) {
        UpdateEnvet.Date = date;
    }
    try {
        let event = await EventModel.findByIdAndUpdate(
            req.params.id, UpdateEnvet, {
                new: true
            });


        if (!event) {
            return res.status(404).send({
                message: `Cant find  event with  this id : ${req.params.id}`
            });
        }
        res.status(201).send(event);

    } catch (error) {
        if (error.kind === 'ObjectId') {
            return res.status(404).send({
                message: `cant find event with this id: ${req.params.id}`
            });

        }
        return res.status(500).send({
            message: `an error occurred during updating event with this id : ${req.params.id}`
        });

    }


};




module.exports = {
    Create,
    Update,
    UpcomingEvents,
    PastEvents

};