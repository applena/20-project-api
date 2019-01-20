'use strict';

const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('./roles-model.js');

const SINGLE_USE_TOKENS = !!process.env.SINGLE_USE_TOKENS;
const TOKEN_EXPIRE = process.env.TOKEN_LIFETIME || '5m';
const SECRET = process.env.SECRET || 'foobar';

const usedTokens = new Set();

const users = new mongoose.Schema({
  username: {type:String, required:true, unique:true},
  password: {type:String, required:true},
  email: {type: String},
  role: {type: String, default:'user', enum: ['admin','editor','user']},
}, { toObject:{virtuals:true}, toJSON:{virtuals:true} });

users.virtual('acl', {
  ref: 'roles',
  localField: 'role',
  foreignField: 'role',
  justOne:true,
});

/** Function that invokes prior to a 'findOne' db query to virtually populate the collection */
users.pre('findOne', function() {
  try {
    this.populate('acl');
  }
  catch(e) {
    throw new Error(e.message);
  }
});

/** Function that invokes prior to a 'findOne' db query to virtually populate the collection */
users.pre('save', function(next) {
  bcrypt.hash(this.password, 10)
    .then(hashedPassword => {
      this.password = hashedPassword;
      next();
    })
    .catch(error => {throw new Error(error);});
});

/**
 *
 * Function that authenticates using OAuth
 * @param email {string} users email
 * @returns {object} new user
 */
users.statics.createFromOauth = function(email) {

  if(! email) { return Promise.reject('Validation Error'); }

  return this.findOne( {email} )
    .then(user => {
      if( !user ) { throw new Error('User Not Found'); }
      return user;
    })
    .catch( error => {
      let username = email;
      let password = 'none';
      return this.create({username, password, email});
    });

};

/**
 *
 * Function that authenticates token against active tokens in db
 * @param {*} token
 * @returns {object} database json object
 */
users.statics.authenticateToken = function(token) {
  console.log('entering the authenticateToken');
  if ( usedTokens.has(token ) ) {
    console.log('token used');
    return Promise.reject('Invalid Token');
  }
  
  try {
    let parsedToken = jwt.verify(token, SECRET);
    console.log({parsedToken});
    (SINGLE_USE_TOKENS) && parsedToken.type !== 'key' && usedTokens.add(token);
    let query = {_id: parsedToken.id};
    return this.findOne(query);
  } catch(e) { 
    console.error('authenticateToken error',e);
    throw new Error('Invalid Token'); 
  }
  
};

/**
 *
 * compares password against stored value using bcrypt
 * @param {object} auth username and password
 * @returns boolean
 */
users.statics.authenticateBasic = function(auth) {
  let query = {username:auth.username};
  return this.findOne(query)
    .then( user => user && user.comparePassword(auth.password) )
    .catch(error => {throw error;});
};


users.methods.comparePassword = function(password) {
  return bcrypt.compare( password, this.password )
    .then( valid => valid ? this : null);
};

/**
 *
 * Generates new token based on requested type
 * @param {string} type denotes token type - key or user
 * @returns signed jwt token
 */
users.methods.generateToken = function(type) {
  
  //console.log('constructing token', {type}, this.username, this.acl)
  let token = {
    id: this._id,
    capabilities: this.acl.capabilities,
    type: type || 'user',
  };
  
  let options = {};
  if ( type !== 'key' && !! TOKEN_EXPIRE ) { 
    options = { expiresIn: TOKEN_EXPIRE };
  }
  
  return jwt.sign(token, SECRET, options);
};

/**
 *
 * Verifies that user it authorized to complete requested action
 * @param {string} capability
 * @returns {boolean}
 */
users.methods.can = function(capability) {
  return this.acl.capabilities.includes(capability);
};

/**
 *
 * invokes generateToken function with key param
 * @returns function
 */
users.methods.generateKey = function() {
  return this.generateToken('key');
};

module.exports = mongoose.model('users', users);
