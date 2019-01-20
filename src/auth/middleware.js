'use strict';

const User = require('./users-model.js');

module.exports = (capability) => {
  
  return (req, res, next) => {
    // console.log('headers', req.headers);

    try {
      let [authType, authString] = req.headers.authorization.split(/\s+/);

      switch (authType.toLowerCase()) {
      case 'basic':
        return _authBasic(authString);
      case 'bearer':
        return _authBearer(authString);
      default:
        return _authError();
      }
    } catch (e) {
      _authError();
    }


    /**
     *
     * Base64 decoding for basic authentication of username and password
     * @param {*} str
     * @returns callback function
     */
    function _authBasic(str) {
    // str: am9objpqb2hubnk=
      let base64Buffer = Buffer.from(str, 'base64'); // <Buffer 01 02 ...>
      let bufferString = base64Buffer.toString();    // john:mysecret
      let [username, password] = bufferString.split(':'); // john='john'; mysecret='mysecret']
      let auth = {username, password}; // { username:'john', password:'mysecret' }

      return User.authenticateBasic(auth)
        .then(user => _authenticate(user))
        .catch(_authError);
    }

    /**
     *
     * Exicutes functions to authenticate a token bearer, and evenutually the user
     * @param {*} authString
     * @returns callback function
     */
    function _authBearer(authString) {
      console.log('entering the _authBearer function');
      return User.authenticateToken(authString)
        .then(user => _authenticate(user))
        .catch(_authError);
    }

    /**
     *
     * Invokes function to check users capabilities and issues jwt token
     * @param {*} user
     */
    function _authenticate(user) {
      console.log('entering the _authenticate function', {capability});
      if ( user && (!capability || (user.can(capability))) ) {
        req.user = user;
        req.token = user.generateToken();
        next();
      }
      else {
        _authError();
      }
    }

    /**
     *
     * Error handling for authentication issues
     * @param {error} err
     */
    function _authError(err) {
      console.error('_authError', err);
      next('Invalid User ID/Password');
    }

  };
  
};