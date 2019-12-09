const express = require("express"),
    passport = require('passport'),
    jwt = require('jsonwebtoken'),
    authorize = require('../_helpers/authorize'),
    Role = require('../_helpers/role'),
    adminController = require('../controllers/admin.controller'),

    AdminRouter = express.Router();

AdminRouter.post('/', authorize(Role.SuperAdmin), adminController.Create);
AdminRouter.delete('/:id', authorize(Role.SuperAdmin), adminController.remove);

// teacherRouter.get('/', authorize(Role.Admin), teacherController.FindAll);
// teacherRouter.get('/:id', authorize(Role.Admin), teacherController.findOne);
// teacherRouter.delete('/:id', authorize(Role.Admin), teacherController.remove);
// teacherRouter.put('/:id', authorize(Role.Admin), teacherController.update);

// StudentRouter.get('/try', authorize(Role.Student), studentController.temp);

module.exports = AdminRouter;