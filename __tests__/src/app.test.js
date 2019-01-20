'use strict';

const supergoose = require('../supergoose.js');
const {app} = require('../../src/app');
const mockRequest = supergoose.server(app);

beforeAll(function () {
  supergoose.startDB();
})
afterAll(supergoose.stopDB);

let token;
let key;

describe('generates user tokens and keys', () => {

  it('add a new role with capabilities', (done) =>{
    return mockRequest
      .post('/newRole')
      .send({ role: 'admin', capabilities: ['read', 'write', 'update', 'delete'] })
      .then(results => {
        expect(results.status).toBe(200);
        done();
      });
  });

  it('add a new user with a role', (done) =>{
    return mockRequest
      .post('/signup')
      .send({ username: 'bob', password: 'yo', role: 'admin'})
      .then(results => {
        token = results.headers.token;
        expect(results.status).toBe(200);
        done();
      });
  });

  it('changes a valid token for a key', (done) =>{
    return mockRequest
      .post('/key')
      .set('Authorization', `bearer ${token}`)
      .then(results => {
        key = results.text;
        expect(results.status).toBe(200);
        done();
      });
  });
});

describe('api server', () => {
  it('should respond with a 404 on an invalid route', (done) => {
    return mockRequest
      .get('/foo')
      .then(results => {
        expect(results.status).toBe(404);
        done();
      });
  });

  it('should respond with a 404 on an invalid method', (done) => {
    return mockRequest
      .post('/api/v1/notes/12')
      .then(results => {
        expect(results.status).toBe(404);
        done();
      });
  });

  it('should respond properly on request to /api/v1/teams', (done) => {
    return mockRequest
      .get('/api/v1/teams')
      .set('Authorization', `bearer ${key}`)
      .then(results => {
        // console.log(results.status, results.body, "hereitis")
        expect(results.status).toBe(200);
        done();
      });

  });

  it('should be able to post to /api/v1/teams', (done) => {

    let obj = {name:'test'};

    return mockRequest
      .post('/api/v1/teams')
      .send(obj)
      .set('Authorization', `bearer ${key}`)
      .then(results => {
        expect(results.status).toBe(200);
        expect(results.body.title).toEqual(obj.title);
        done();
      });

  });

  it('should be able to post to /api/v1/players', (done)  => {

    let obj = {name:'John', bats:'R',throws:'R',position:'C',team:'Bunnies'};

    return mockRequest
      .post('/api/v1/players')
      .send(obj)
      .set('Authorization', `bearer ${key}`)
      .then(results => {
        expect(results.status).toBe(200);
        expect(results.body.team).toEqual(obj.team);
        done();
      });

  });


  it('following a post to players, should find a single record', (done) => {

    let obj = {name:'John', bats:'R',throws:'R',position:'C',team:'Bunnies'};

    return mockRequest
      .post('/api/v1/players')
      .send(obj)
      .set('Authorization', `bearer ${key}`)
      .then(results => {
        return mockRequest
          .get(`/api/v1/players/${results.body._id}`)
          .set('Authorization', `bearer ${key}`)
          .then(list => {
            expect(list.status).toBe(200);
            expect(list.body.team).toEqual(obj.team);
            done();
          });
      });

  });

});
