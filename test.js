var s = require('./');
var sinon = require('sinon');
var Promise = require('bluebird');
var should = require('should');

describe('Service composer', function () {
	it('should compose service and validation functions', function (done) {
		var validator = sinon.stub().returns(Promise.resolve());
		var method = sinon.spy();

		var validation = {
			test: validator
		};

		var methods = {
			test: method
		};

		var service = s(methods, validation);

		var data = { hello: 'world' };

		service.test(data).then(function () {
			method.calledOnce.should.be.ok;
			validator.calledOnce.should.be.ok;

			method.calledWith(data).should.be.ok;
			validator.calledWith(data).should.be.ok;

			done();
		});
	});

	it('should fail validation', function (done) {
		var validator = sinon.stub().returns(Promise.reject('rejection'));
		var method = sinon.spy();

		var validation = {
			test: validator
		};

		var methods = {
			test: method
		};

		var service = s(methods, validation);

		var data = { hello: 'world' };

		service.test(data).catch(function (err) {
			method.notCalled.should.be.ok;
			validator.calledOnce.should.be.ok;

			validator.calledWith(data).should.be.ok;

			err.should.be.exactly('rejection');

			done();
		});
	})
});
