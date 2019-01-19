'use strict';

/**
 * API Server Module
 * @module src/app
 */

// 3rd Party Resources
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const swaggerUi = require('swagger-ui-express');
const swaggerDocs = require('../swaggerDocs/swagger.json');


// Esoteric Resources
const errorHandler = require('./middleware/500.js');
const notFound = require( './middleware/404.js' );
const v1Router = require( './api/v1.js' );
const authRouther = require('./auth/router');

// Prepare the express app
const app = express();

// App Level MW
app.use(cors());
app.use(morgan('dev'));

app.use(express.json());
app.use(express.urlencoded({extended:true}));

// Static Routes
app.use('/docs', express.static('docs'));

// Routes
app.use(v1Router);
app.use(authRouther);

// Swagger
app.use('/swagger', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Catchalls
app.use(notFound);
app.use(errorHandler);

/**
 * Start Server on specified port
 * @param port {integer} (defaults to process.env.PORT)
 */
let start = (port = process.env.PORT) => {
  app.listen(port, () => {
    console.log(`Server Up on ${port}`);
  });
};
  
module.exports = {app,start};
