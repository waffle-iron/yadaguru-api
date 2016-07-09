var request = require('supertest');
var chai = require('chai');
chai.should();
var app = require('../../app.js');
var config = require('../../config')[process.env.DEPLOY_MODE];
var models = require('../../models');

describe('/api/users', function() {
  describe('POST', function() {

    before(function(done) {
      models.sequelize.sync(config.dbSyncOptions).then(function() {
        done();
      });
    });

    it('should respond with user id when phone number is valid', function(done) {
      var json = { phoneNumber: '1234567890' };

      request(app)
        .post('/api/users')
        .type('json')
        .send(json)
        .expect(200)
        .end(function(err, res) {
          if (err) return done(err);
          res.body.should.have.property('id');
          res.body.should.have.property('phoneNumber', '1234567890');
          done();
        });
    });
    it('should respond with error when phone number already exists', function(done) {
      var json = { phoneNumber: '1234567890' };

      request(app)
        .post('/api/users')
        .type('json')
        .send(json)
        .expect(409)
        .end(function(err, res) {
          if (err) return done(err);
          res.error.text.should.be.equal('Resource already exists');
          done();
        });
    });
    it('should respond with error when phone number is not ten digits', function(done) {
      var json = { phoneNumber: '12345678901' };

      request(app)
        .post('/api/users')
        .type('json')
        .send(json)
        .expect(400)
        .end(function(err, res) {
          if (err) return done(err);
          res.error.text.should.be.equal('Invalid Phone Number: Must be 10 digits');
          done();
        });
    });

    it('should respond with error when phone number contains letters', function(done) {
      var json = { phoneNumber: '123456e890' }

      request(app)
        .post('/api/users')
        .type('json')
        .send(json)
        .expect(400)
        .end(function(err, res) {
          if (err) return done(err);
          res.error.text.should.be.equal('Invalid Phone Number: Must be 10 digits');
          done();
        });
    });
  });
});
