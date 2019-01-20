![CF](http://i.imgur.com/7v5ASc8.png) LAB
=================================================

## Auth/API Server

### Author: Lena Eivy and Brent Woodward

### Links and Resources
[![Build Status](https://www.travis-ci.com/applena/20-project-api.svg?branch=master)](https://www.travis-ci.com/applena/20-project-api)
* [repo](https://github.com/applena/20-project-api)
* [travis](https://www.travis-ci.com/applena/20-project-api)
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
* `PORT` - Port Number
* `MONGODB_URI` - URL to the running mongo instance/db

#### Running the app
* `npm start`
* Endpoint: `/foo/bar/`
  * Returns a JSON object with abc in it.
* Endpoint: `/bing/zing/`
  * Returns a JSON object with xyz in it.
  
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

* How do you run tests?
* What assertions were made?
* What assertions need to be / should be made?

#### UML
Link to an image of the UML for your application and response to events
