![CF](http://i.imgur.com/7v5ASc8.png) LAB
=================================================

## Project Name

### Author: Student/Group Name

### Links and Resources
* [repo](http://xyz.com)
* [travis](http://xyz.com)
* [back-end](http://xyz.com) (when applicable)
* [front-end](http://xyz.com) (when applicable)

#### Documentation
* [swagger](http://xyz.com) (API assignments only)
* [jsdoc](http://xyz.com) (All assignments)

### Modules
#### `modulename.js`
##### Exported Values and Methods

###### `foo(thing) -> string`
Usage Notes or examples

###### `bar(array) -> array`
Usage Notes or examples

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
