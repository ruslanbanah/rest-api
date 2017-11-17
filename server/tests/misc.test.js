import request from 'supertest-as-promised';
import httpStatus from 'http-status';
import jwt from 'jsonwebtoken';
import chai, { expect } from 'chai';
import app from '../../index';
import config from '../../config/config';

chai.config.includeStack = true;
const adminCredentials = {
  email: 'admin@admin.com',
  password: 'admin',
};

describe('## Misc', () => {
  describe('# GET /api/ping', () => {
    it('should return OK', (done) => {
      request(app)
        .get('/api/v1/ping')
        .expect(httpStatus.OK)
        .then((res) => {
          expect(res.body.status).to.equal('ok');
          done();
        })
        .catch(done);
    });
  });

  describe('# GET /api/404', () => {
    it('should return 404 status', (done) => {
      request(app)
        .get('/api/v1/404')
        .expect(httpStatus.NOT_FOUND)
        .then((res) => {
          expect(res.body.message).to.equal('Not Found');
          done();
        })
        .catch(done);
    });
  });

  describe('# Error Handling', () => {
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
    
    it('should handle mongoose CastError - Cast to ObjectId failed', (done) => {
      request(app)
        .get('/api/v1/users/56z787zzz67fc')
        .set('Authorization', adminJwtToken)
        .expect(httpStatus.INTERNAL_SERVER_ERROR)
        .then((res) => {
          expect(res.body.message).to.equal('Internal Server Error');
          done();
        })
        .catch(done);
    });

    it('should handle express validation error - email adn password is required', (done) => {
      request(app)
        .post('/api/v1/users')
        .set('Authorization', adminJwtToken)
        .send({
          username: 'test',
        })
        .expect(httpStatus.BAD_REQUEST)
        .then((res) => {
          expect(res.body.message).to.equal('"email" is required and "password" is required');
          done();
        })
        .catch(done);
    });
  });
});
