const express = require("express"),
    passport = require('passport'),
    jwt = require('jsonwebtoken'),
    authorize = require('../_helpers/authorize'),
    Role = require('../_helpers/role'),
    UserEventsController = require('../controllers/user.events.controller');
const EventRouter = express.Router();

EventRouter.post('/assignUser', authorize([Role.SuperAdmin, Role.Admin]), UserEventsController.assignUser);
EventRouter.get('/userEvents/:id', authorize([Role.SuperAdmin, Role.Admin]), UserEventsController.userEvents);
EventRouter.get('/eventUsers/:id', authorize([Role.SuperAdmin, Role.Admin]), UserEventsController.eventUsers);

EventRouter.get('/userUpcomingEvents', authorize([Role.User]), UserEventsController.userUpcomingEvents);
EventRouter.get('/userPastEvents', authorize([Role.User]), UserEventsController.userPastEvents);

EventRouter.post('/register', authorize([Role.User]), UserEventsController.UserRegisterToEvent);
EventRouter.delete('/cancel', authorize([Role.User]), UserEventsController.cancelUserRegistration);


// EventRouter.put('/:id', authorize([Role.SuperAdmin]), EventController.Update);
// EventRouter.get('/UpcomingEvents', authorize([Role.SuperAdmin, Role.Admin]), EventController.UpcomingEvents);
// EventRouter.get('/PastEvents', authorize([Role.SuperAdmin, Role.Admin]), EventController.PastEvents);


// EventRouter.get('/', ExamController.FindAll);
// EventRouter.put('/:id', ExamController.Update);
// EventRouter.delete('/:id', ExamController.Remove);


// StudentRouter.get('/try', authorize(Role.Student), studentController.temp);

module.exports = EventRouter;