const mongoose = require('mongoose'),
    Schema = mongoose.Schema;


const EventModel = new Schema({


    Title: {
        type: String,

    },
    Body: String,
    Date: {
        type: Date,
        // default: Date.now
    },

    // Creator: {
    //     type: Number,
    //     ref: 'User'
    // },
    // subscribe: [{
    //     type: Number,
    //     ref: 'User'

    // }]
});

mongoose.model('Event', EventModel);