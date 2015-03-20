var s = require('./');
var sinon = require('sinon');
var Promise = require('bluebird');
var should = require('should');

describe('Service composer', function () {
	it('should compose service and validation functions', function (done) {
		var data = { hello: 'world' };
		var data2 = { beep: 'boop' };

		var validator = sinon.stub().returns(Promise.resolve());
		var transform = sinon.stub().returns(data2);
		var method = sinon.spy();

		var validation = {
			test: validator
		};

		var methods = {
			test: method
		};

		var transforms = {
			test: transform
		};

		var service = s({
			methods: methods,
			validation: validation,
			transforms: transforms
		});

		service.test(data).then(function () {
			method.calledOnce.should.be.ok;
			validator.calledOnce.should.be.ok;
			transform.calledOnce.should.be.ok;

			method.calledWith(data2).should.be.ok;
			validator.calledWith(data2).should.be.ok;
			transform.calledWith(data).should.be.ok;

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

		var service = s({ methods: methods, validation: validation});

		var data = { hello: 'world' };

		service.test(data).catch(function (err) {
			method.notCalled.should.be.ok;
			validator.calledOnce.should.be.ok;

			validator.calledWith(data).should.be.ok;

			err.should.be.exactly('rejection');

			done();
		});
	});

	it('method should return promise', function (done) {
		s({ methods: { test: function() {} }}).test().then(done);
	});
});
