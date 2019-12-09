const express = require("express"),
    passport = require('passport'),
    jwt = require('jsonwebtoken'),
    authorize = require('../_helpers/authorize'),
    Role = require('../_helpers/role'),
    userEventRoute = require('../routes/user.events.routes'),
    EventController = require('../controllers/event.controller');
const EventRouter = express.Router();

EventRouter.use("/", userEventRoute);
EventRouter.post('/', authorize([Role.SuperAdmin]), EventController.Create);
EventRouter.put('/:id', authorize([Role.SuperAdmin]), EventController.Update);
EventRouter.get('/UpcomingEvents', authorize([Role.SuperAdmin, Role.Admin]), EventController.UpcomingEvents);
EventRouter.get('/PastEvents', authorize([Role.SuperAdmin, Role.Admin]), EventController.PastEvents);


// EventRouter.get('/', ExamController.FindAll);
// EventRouter.put('/:id', ExamController.Update);
// EventRouter.delete('/:id', ExamController.Remove);


// StudentRouter.get('/try', authorize(Role.Student), studentController.temp);

module.exports = EventRouter;