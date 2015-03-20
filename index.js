var _ = require('lodash');
var Promise = require('bluebird');

function Service (methods, validation, transforms) {
	_.mapValues(methods, buildMethod, this);

	function buildMethod(method, methodName) {
		var transform = _.isFunction(transforms[methodName]) ? transforms[methodName] : _.identity;
		var validate  = _.isFunction(validation[methodName]) ? validation[methodName] : _.identity;

		this[methodName] = function serviceMethod () {
			var args = Array.prototype.slice.apply(arguments);

			// By convetion first argument of service method is always params object
			// Params transform
			args[0] = transform(args[0]);

			return Promise
				.resolve(validate(args[0]))
				.return(args)
				.spread(method);
		};
	}

}

function buildService (opts) {
	if (!_.isObject(opts.methods)) {
		throw new Error('Service methods should be object');
	}

	if (opts.validation && !_.isObject(opts.validation)) {
		throw new Error('Service validation should be object');
	}

	if (opts.transforms && !_.isObject(opts.transforms)) {
		throw new Error('Service transforms should be object');
	}

	return new Service(
		opts.methods,
		opts.validation || {},
		opts.transformas || {}
	);
}

module.exports = buildService;
