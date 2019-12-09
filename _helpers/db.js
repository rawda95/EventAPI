const mongoose = require('mongoose');

//local connect 
//mongoose.connect('mongodb://127.0.0.1:27017/Events', { useNewUrlParser: true, useFindAndModify: false });


// remote onnect 
mongoose.connect('mongodb+srv://admin:admin@event-zkksp.mongodb.net/test?retryWrites=true&w=majority', { useNewUrlParser: true });
mongoose.connection.on('error', error => console.log(error));
mongoose.connection.on('connected', function() {
    console.log('connectd to db ');
});
mongoose.Promise = global.Promise;