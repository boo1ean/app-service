var _ = require('lodash');

function compose (methods, validation) {
	if (!_.isObject(methods)) {
		throw new Error('Service must be an object');
	}

	if (!_.isObject(validation)) {
		throw new Error('Validation must be an object');
	}

	return _.mapValues(methods, function forEachServiceMethod (method, methodName) {
		if (_.isFunction(validation[methodName])) {
			var validator = validation[methodName];
			return function validatedServiceMethod () {
				var args = arguments;
				return validator.apply(this, args).then(function afterSuccessfulValidation () {
					return method.apply(this, args);
				});
			}
		}

		return method;
	});
}

module.exports = compose;
