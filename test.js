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

		var service = s({ methods: methods, validation: validation});

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

	it('should call before, validation, after', function (done) {
		var calls = [];

		var d = {
			data: [1, 2, 3],
			a: 5
		};

		var d1 = {
			q: [1, 2, 5, 6, 3],
			z: 18
		};

		var ctx = { k: 1, t: 3};

		var expectedCtx = { k: 1, t: 3, methodName: 'test' };

		function before (dd, dd1) {
			d.should.be.eql(dd);
			d1.should.be.eql(dd1);
			this.should.be.eql(expectedCtx);
			calls.push('before');
		}

		function validate (dd, dd1) {
			d.should.be.eql(dd);
			d1.should.be.eql(dd1);
			this.should.be.eql(expectedCtx);
			calls.push('validate');
		}

		function test (dd, dd1) {
			d.should.be.eql(dd);
			d1.should.be.eql(dd1);
			this.should.be.eql(expectedCtx);
			calls.push('test');
		}

		function after (dd, dd1) {
			d.should.be.eql(dd);
			d1.should.be.eql(dd1);
			this.should.be.eql(expectedCtx);
			calls.push('after');
		}

		var service = s({
			methods: { test: test },
			validation: { test: validate },
			before: before,
			after: after
		});

		service.test.call(ctx, d, d1).then(function () {
			calls.should.be.eql(['before', 'validate', 'test', 'after']);
			done();
		});
	});

	it('method should return promise', function (done) {
		s({ methods: { test: function() {} }}).test().then(done);
	});
});
