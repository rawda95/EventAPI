const mongoose = require('mongoose'),
    Schema = mongoose.Schema;


const UserEventsModel = new Schema({

    event: {
        type: Schema.Types.ObjectId,
        ref: 'Event'
    },
    user: {
        type: Number,
        ref: 'User'
    },
    joinDate :{
        type :Date,
        defult: new Date
    }
  

});

mongoose.model('UserEvents', UserEventsModel);