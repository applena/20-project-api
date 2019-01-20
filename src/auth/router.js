'use strict';

const express = require('express');
const authRouter = express.Router();

const User = require('./users-model.js');
const Role = require('./roles-model');
const auth = require('./middleware.js');
const oauth = require('./oauth/google.js');

authRouter.post('/signup', (req, res, next) => {
  let user = new User(req.body);
  user.save()
    .then( (user) => {
      User.findOne({_id: user._id})
        .then(user => {
          req.token = user.generateToken();
          req.user = user;
          res.set('token', req.token);
          res.cookie('auth', req.token);
          res.send(req.token);
        });
    })
    .catch(next);
});

authRouter.post('/signin', auth(), (req, res, next) => {
  res.cookie('auth', req.token);
  res.send(req.token);
});

authRouter.post('/newRole', (req, res, next) => {
  console.log(req.body);
  let role = new Role(req.body);
  role.save()
    .then(results => {
      Role.findOne({_id: results._id})
        .then(role => {
          req.token = role.generateToken();
          req.role = role;
          res.set('token', req.token);
          res.cookie('auth', req.token);
          res.status(200).send(role.name);
        });
    })
    .catch(next);
});

authRouter.get('/oauth', (req,res,next) => {
  oauth.authorize(req)
    .then( token => {
      res.status(200).send(token);
    })
    .catch(next);
});

authRouter.post('/key', auth(), (req,res,next) => {
  let key = req.user.generateKey();
  res.status(200).send(key);
});

module.exports = authRouter;
