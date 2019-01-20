'use strict';

const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

const TOKEN_EXPIRE = process.env.TOKEN_LIFETIME || '5m';
const SECRET = process.env.SECRET || 'foobar';

const roles = new mongoose.Schema({
  role: {type: String, required:true},
  capabilities: {type: Array, required:true},
});

/**
 * Generates new token based on requested type
 * @param {string} type denotes token type - key or user
 * @returns generated token
 */
roles.methods.generateToken = function(type) {
  
  let token = {
    id: this._id,
    capabilities: this.capabilities,
    type: this.role || 'user',
  };
  
  let options = {};
  if ( type !== 'key' && !! TOKEN_EXPIRE ) { 
    options = { expiresIn: TOKEN_EXPIRE };
  }
  
  return jwt.sign(token, SECRET, options);
};

module.exports = mongoose.model('roles', roles);
