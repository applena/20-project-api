![CF](http://i.imgur.com/7v5ASc8.png) LAB
=================================================

## Auth/API Server

### Author: Lena Eivy and Brent Woodward

### Links and Resources
[![Build Status](https://www.travis-ci.com/applena/20-project-api.svg?branch=master)](https://www.travis-ci.com/applena/20-project-api)
* [repo](https://github.com/applena/20-project-api)
* [travis](https://www.travis-ci.com/applena/20-project-api.svg?branch=master)
* [back-end](https://authapiserver.herokuapp.com/) (when applicable)

#### Documentation
* [swagger](https://authapiserver.herokuapp.com/swagger/) (API assignments only)
* [jsdoc](https://authapiserver.herokuapp.com/docs/) (All assignments)

### Modules
#### `models/mongo.js`
##### Exported Values and Methods
###### `Model(schema) -> Class`
Builds a Class according to the schema that is passed to it to model data.

#### `middleware/500.js`
##### Exported Values and Methods
###### `(err, req, res, next) -> res.status(500)`
Catches server errors and displays 500 status message with error information.

#### `middleware/404.js`
##### Exported Values and Methods
###### `(req, res, next) -> res.status(404)`
Catches route errors and displays 404 status message with error information.

#### `middleware/model-finder.js`
##### Exported Values and Methods
###### `(req, res, next) -> require(string for filepath)`
Parses request object for model parameter. Requires in correct file using template literal and this param.

#### `auth/middleware.js`
##### Exported Values and Methods
###### `(req, res, next) -> (req, res, next)`
Processes functions based on request header content. Authorizes and issues JWT tokens.

#### `auth/router.js`
##### Exported Values and Methods
###### `express router`
Builds authentication based routes for signup, signin,create new role, oauth, and create key.

#### `api/v1.js`
##### Exported Values and Methods
###### `express router`
Buildes API routes for accessing database information to get, get all, post, put, and delete.

#### `auth/roles-model.js`
##### Exported Values and Methods
###### `mongoose schema and model`
Schema/Model for creating new roles and assigning role based capabilities.

#### `auth/users-model.js`
##### Exported Values and Methods
###### `instance of user class using schema`
Model for creating new users.

#### `models/players/players-model.js`
##### Exported Values and Methods
###### `instance of player class using schema`
Model for creating new players.

#### `models/players/players-schema.js`
##### Exported Values and Methods
###### `mongoose schema`
Schema for formatting data for use in the database.

#### `models/teams/teams-model.js`
##### Exported Values and Methods
###### `instance of teams class using schema`
Model for creating new teams and 

#### `models/teams/teams-schema.js`
##### Exported Values and Methods
###### `mongoose schema`
Schema for formatting data for use in the database.

### Setup
#### `.env` requirements
* `PORT` - port 3000 or connect to heroku
* `MONGODB_URI` - URL to the running mongo instance/db

#### Running the app
* `npm start`
* Endpoint: `/signup`
  * Returns a token after successful signup providing a username and passwords
* Endpoint: `/signin`
  * Returns a token after successfully signing in
* Endpoint: `/key`
  * Returns a key in exchange for a working token.
* Endpoint: `/api/v1/players`
  * Returns a JSON list of all the players
* Endpoint: `/api/v1/teams`
  * Returns a JSON object with all the teams.
* Endpoint: `/api/v1/players/id`
  * Returns a JSON object with the player with the specified id.
* Endpoint: `/api/v1/teams/id`
  * Returns a JSON object with the team wiht the specifed id.
  
# Tests

## Create User

```bash
ROLE_NAME=user
USER_NAME=bob
CAPABILITIES='["read"]'

# creates a user role and captures the JWT in $USER_TOKEN
ROLE_TOKEN=$(http -h POST :3000/newRole role=$ROLE_NAME capabilities:=$CAPABILITIES | grep token | awk '{print $2}')

# Create a user with the role
USER_TOKEN=$(http POST :3000/signup username=$USER_NAME password=yo role=user)

# Change user token into a Key
USER_KEY=$(http POST :3000/key authorization:bearer\ $USER_TOKEN)
```

## Create an Admin

```bash
ROLE_NAME=admin
USER_NAME=root
CAPABILITIES='["read","write","update","delete"]'

# creates a user role and captures the JWT in $USER_TOKEN
ROLE_TOKEN=$(http -h POST :3000/newRole role=$ROLE_NAME capabilities:=$CAPABILITIES | grep token | awk '{print $2}')

# Create a admin with the role
ADMIN_TOKEN=$(http POST :3000/signup username=$USER_NAME password=yo role=admin)

# Change admin token into a Key
ADMIN_KEY=$(http POST :3000/key authorization:bearer\ $ADMIN_TOKEN)
```

## Create a Player

Requires `$ADMIN_KEY`

```bash
NAME=playertest
POSITION=P
THROWS=R
BATS=R
TEAM=CATS
http POST :3000/api/v1/players name=$NAME position=$POSITION throws=$THROWS bats=$BATS team=$TEAM authorization:bearer\ $ADMIN_KEY
```

## Demonstrate Failure of a user to create a Player

Requires `$USER_KEY`

```bash
NAME=playertest
POSITION=P
THROWS=R
BATS=R
TEAM=CATS
http POST :3000/api/v1/players name=$NAME position=$POSITION throws=$THROWS bats=$BATS team=$TEAM authorization:bearer\ $USER_KEY

# You should get an invalid userid/password error
```
## Create a Team

Requires `$ADMIN_KEY`

```bash
NAME=CATS
http POST :3000/api/v1/teams name=$NAME authorization:bearer\ $ADMIN_KEY
```

## Demonstrate Failure of a user to create a team

Requires `$USER_KEY`

```bash
NAME=CATS
http POST :3000/api/v1/teams name=$NAME authorization:bearer\ $USER_KEY
# You should get an invalid userid/password error
```

## User can display team and play info
Requires `$USER_KEY`

```bash
http :3000/api/v1/teams authorization:bearer\ $USER_KEY
http :3000/api/v1/players authorization:bearer\ $USER_KEY
```
## ADMIN can Change a Player

Requires `$ADMIN_KEY`

```bash
NAME=playertest
POSITION=P
THROWS=L
BATS=R
TEAM=CATS

# get the user id
USER_ID=$(http :3000/api/v1/players authorization:bearer\ $USER_KEY | jq -r .results[0]._id)


http PUT :3000/api/v1/players/$USER_ID name=$NAME position=$POSITION throws=$THROWS bats=$BATS team=$TEAM authorization:bearer\ $ADMIN_KEY
```

## ADMIN can Change a TEAM

Requires `$ADMIN_KEY`

```bash
NAME=DOGS

# get the user id
TEAM_ID=$(http :3000/api/v1/teams authorization:bearer\ $USER_KEY | jq -r .results[0]._id)


http PUT :3000/api/v1/teams/$TEAM_ID name=$NAME authorization:bearer\ $ADMIN_KEY
```

## USER cannot change a player

Requires `$USER_KEY`

```bash
NAME=playertest
POSITION=P
THROWS=L
BATS=R
TEAM=CATS

# get the user id
USER_ID=$(http :3000/api/v1/players authorization:bearer\ $USER_KEY | jq -r .results[0]._id)


http PUT :3000/api/v1/players/$USER_ID name=$NAME position=$POSITION throws=$THROWS bats=$BATS team=$TEAM authorization:bearer\ $USER_KEY

# should throw an error
```

## USER cannot change a team
Requires `$USER_KEY`

```bash
NAME=DOGS

# get the user id
TEAM_ID=$(http :3000/api/v1/teams authorization:bearer\ $USER_KEY | jq -r .results[0]._id)


http PUT :3000/api/v1/teams/$TEAM_ID name=$NAME authorization:bearer\ $USER_KEY
# should throw an error
```

## ADMIN can delete a player
Requires `$ADMIN_KEY`

```bash

# get the user id
USER_ID=$(http :3000/api/v1/players authorization:bearer\ $USER_KEY | jq -r .results[0]._id)


http DELETE :3000/api/v1/players/$USER_ID authorization:bearer\ $ADMIN_KEY
```


## ADMIN can delete a team

Requires `$ADMIN_KEY`

```bash

# get the user id
TEAM_ID=$(http :3000/api/v1/teams authorization:bearer\ $USER_KEY | jq -r .results[0]._id)


http DELETE :3000/api/v1/teams/$TEAM_ID authorization:bearer\ $ADMIN_KEY
```

## USER cannot delete a player
Requires `$USER_KEY`

```bash

# get the user id
USER_ID=$(http :3000/api/v1/players authorization:bearer\ $USER_KEY | jq -r .results[0]._id)


http DELETE :3000/api/v1/players/$USER_ID authorization:bearer\ $USER_KEY
# should throw an error
```


## USER cannot delete a team

Requires `$USER_KEY`

```bash

# get the user id
TEAM_ID=$(http :3000/api/v1/teams authorization:bearer\ $USER_KEY | jq -r .results[0]._id)


http DELETE :3000/api/v1/teams/$TEAM_ID authorization:bearer\ $USER_KEY
# should throw an error
```

## RUNNING THE UNIT TESTS
* `npm test`
* asserting that all routes are reachable and deliver what we think they should
* asserting that the signup route signs up a user
* asserting that the signin route sings in a user
* asserting that the key route returns a key that never expires and can be used multiple times.

## How do I add models?
* To add additional models, you can simply make a new class that extends the model you want. For example, 
```class Teams extends Model {}```
* The teams model is extending the Model. You can extend the Model to create almost anything you want.

## How do I add new OAuth Providers?
* To add a new OAuth provider, use the Google OAuth code as a guide. You will need to visit the OAuth provider that you want to use and follow their documentaiton, but you should be able to adapt the Google code to make it easier. 

## How do I identify an OAUth provider
* This will depend on what your needs are and who your clients are. OAuth is a good option as is Wordpress and Google. 

## How do I setup my .env? How do I set that up remotely?
* To set up your .env, you will need to specify the following variable:
```
MONGODB_URI=mongodb://localhost:27017/users
PORT=3000
SECRET=changeit
TOKEN_LIFETIME=900000
SINGLE_USE_TOKENS=true
```

## What routes are supported?
* user routes:
/signup
/signin
/key
/newRole
/oauth

* teams routes:
/api/v1/teams
/api/v1/teams/id

* players routes:
/api/v1/players
/api/v1/players/id

## How do I call them and what data do they expect?
* To call the routes, go to the heroku site or your local host and add the route to the end of the URL

## expected data
/signup => a one time use temporary token
/signin => a one time use temporary token
/newRole => a one time use token
/oauth => a one time use token
/key => a key that never expires and can be resued
/api/v1/teams => a JSON data set of all the teams in the database
/api/v1/teams/id => a JSON object with info about the team whos id you specified
/api/v1/players => a JSON data set of all the players in the database
/api/v1/playsers/id => a JSON object with info about the players whoees id you specified

## What format does data come back?
* Data is returned in the form of a JSON object.