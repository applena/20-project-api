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
  
#### Tests
* CREATE AN ADMIN: the frist step is to create a new Role that has admin prividledges. `http post :3000/newRole role=admin capabilities=[read,write,update,delete]` Once you have an admin role set up, you can use this role to crate a new user.

* Upon successfull completion of your admin role creation, you should recieve a token. 

* CREATE A NEW USER: now that the admin role exists, create a new user: `http POST :3000/signup username=super password=yo role=admin'

* GENERATE A KEY: Upon successfull completeion of your new admin user, you will recieve a new token. Use this token to generate a key that never expires and can be used muliple time: `http POST :3000/key authorization:bearer\ {your token goes here}`

* this will generate a key that you can use multiple times that never expires with admin prividlidges - like this one: `http POST :3000/key authorization:bearer\ eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVjNDM1NzkzYWU4ZTc5MjAyMjRlZTc5NyIsImNhcGFiaWxpdGllcyI6WyJyZWFkLHdyaXRlIl0sInR5cGUiOiJ1c2VyIiwiaWF0IjoxNTQ3OTE3MjAzLCJleHAiOjE1NDc5MTgxMDN9.j-lljuxYaBXY0XK6nDuziWP6mWfLalcqXa9dZz4oLRQ`

* ADD A PLAYER TO THE /api/v1/players PATH: using the key that we generated (or the one provided), enter the following: `http :3000/api/v1/players name=playersTest position=P throws=R bats=R team=CATS authorization:bearer\ eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVjNDM1NzkzYWU4ZTc5MjAyMjRlZTc5NyIsImNhcGFiaWxpdGllcyI6WyJyZWFkLHdyaXRlIl0sInR5cGUiOiJ1c2VyIiwiaWF0IjoxNTQ3OTE3MjAzLCJleHAiOjE1NDc5MTgxMDN9.j-lljuxYaBXY0XK6nDuziWP6mWfLalcqXa9dZz4oLRQ`


* How do you run tests?
* What assertions were made?
* What assertions need to be / should be made?

#### UML
Link to an image of the UML for your application and response to events
