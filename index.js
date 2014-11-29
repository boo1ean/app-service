var _ = require('lodash');
var Promise = require('bluebird');

var defaults = {
	methods: null,
	validation: null,
	before: null,
	after: null
};

function noop () {}

function configure (opts) {
	if (!_.isObject(opts)) {
		throw new Error('Service configuration should be an object');
	}

	defaults = _.extend(defaults, opts);
}

function compose (opts) {
	if (!_.isObject(opts)) {
		throw new Error('Service configuration should be an object');
	}

	if (!_.isObject(opts.methods)) {
		throw new Error('Service methods should be an object');
	}

	_.defaults(opts, defaults);

	var before = _.isFunction(opts.before) ? opts.before : noop;
	var after = _.isFunction(opts.after) ? opts.after : noop;
	var validation = _.isObject(opts.validation) ? opts.validation : {};

	return _.mapValues(opts.methods, function forEachServiceMethod (method, methodName) {
		var validator = validation[methodName] || noop;

		return function serviceMethod () {
			var returnValue;
			var self = this;
			var args = arguments;

			return Promise.method(before).apply(self, args)
				.then(function () {
					return validator.apply(self, args);
				})
				.then(function () {
					return method.apply(self, args);
				})
				.then(function (result) {
					returnValue = result;
					return after.apply(self, args);
				})
				.then(function () {
					return returnValue;
				});
		};
	});
}

module.exports = compose;
