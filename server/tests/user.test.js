import mongoose from 'mongoose';
import request from 'supertest-as-promised';
import httpStatus from 'http-status';
import chai, { expect } from 'chai';
import jwt from 'jsonwebtoken';
import config from '../../config/config';
import app from '../../index';
import userStatus from '../helpers/userStatus'
import userRoles from '../helpers/userRoles'

chai.config.includeStack = true;

/**
 * root level hooks
 */
after((done) => {
  mongoose.models = {};
  mongoose.modelSchemas = {};
  mongoose.connection.close();
  done();
});

describe('## User APIs', () => {
  let user = {
    email: 'testuser' + Math.floor((Math.random() * 100) + 1) + '@test.com',
    password: 'test',
    username: 'tester',
  };
  const adminCredentials = {
    email: 'admin@admin.com',
    password: 'admin',
  };
  
  let adminJwtToken;
  
  it('Admin: should get valid JWT token', (done) => {
    request(app)
      .post('/api/v1/auth/login')
      .send(adminCredentials)
      .expect(httpStatus.OK)
      .then((res) => {
        expect(res.body).to.have.property('token');
        jwt.verify(res.body.token, config.jwtSecret, (err, decoded) => {
          expect(err).to.not.be.ok;
          expect(decoded.email).to.equal(adminCredentials.email);
          adminJwtToken = `Bearer ${res.body.token}`;
          done();
        });
      })
      .catch(done);
  });

  describe('# POST /api/v1/users', () => {
    it('should create a new user', (done) => {
      request(app)
        .post('/api/v1/users')
        .set('Authorization', adminJwtToken)
        .send(user)
        .expect(httpStatus.OK)
        .then((res) => {
          expect(res.body.username).to.equal(user.username);
          expect(res.body.email).to.equal(user.email);
          expect(res.body.status).to.equal(userStatus[0]);
          expect(res.body.role).to.equal(userRoles[0]);
          user = res.body;
          done();
        })
        .catch(done);
    });
  });

  describe('# GET /api/v1/users/:userId', () => {
    it('should get user details', (done) => {
      request(app)
        .get(`/api/v1/users/${user._id}`)
        .set('Authorization', adminJwtToken)
        .expect(httpStatus.OK)
        .then((res) => {
          expect(res.body.username).to.equal(user.username);
          expect(res.body.email).to.equal(user.email);
          expect(res.body.status).to.equal(userStatus[0]);
          expect(res.body.role).to.equal(userRoles[0]);
          done();
        })
        .catch(done);
    });

    it('should report error with message - Not found, when user does not exists', (done) => {
      request(app)
        .get('/api/v1/users/56c787ccc67fc16ccc1a5e92')
        .set('Authorization', adminJwtToken)
        .expect(httpStatus.NOT_FOUND)
        .then((res) => {
          expect(res.body.message).to.equal('Not Found');
          done();
        })
        .catch(done);
    });
  });

  describe('# PUT /api/v1/users/:userId', () => {
    it('should update user details', (done) => {
      user.username = 'KK';
      user.role = userRoles[1];
      user.status = userStatus[1];
      request(app)
        .put(`/api/v1/users/${user._id}`)
        .set('Authorization', adminJwtToken)
        .send(user)
        .expect(httpStatus.OK)
        .then((res) => {
          expect(res.body.username).to.equal('KK');
          expect(res.body.email).to.equal(user.email);
          expect(res.body.status).to.equal(user.status);
          expect(res.body.role).to.equal(user.role);
          done();
        })
        .catch(done);
    });
  });

  describe('# GET /api/users/', () => {
    it('should get all users', (done) => {
      request(app)
        .get('/api/v1/users')
        .set('Authorization', adminJwtToken)
        .expect(httpStatus.OK)
        .then((res) => {
          expect(res.body).to.be.an('array');
          done();
        })
        .catch(done);
    });

    it('should get all users (with limit and skip)', (done) => {
      request(app)
        .get('/api/v1/users')
        .set('Authorization', adminJwtToken)
        .query({ limit: 10, skip: 1 })
        .expect(httpStatus.OK)
        .then((res) => {
          expect(res.body).to.be.an('array');
          done();
        })
        .catch(done);
    });
  });

  describe('# DELETE /api/v1/users/', () => {
    it('should delete user', (done) => {
      request(app)
        .delete(`/api/v1/users/${user._id}`)
        .set('Authorization', adminJwtToken)
        .expect(httpStatus.OK)
        .then((res) => {
          expect(res.body.username).to.equal(user.username);
          expect(res.body.email).to.equal(user.email);
          done();
        })
        .catch(done);
    });
  });
});
