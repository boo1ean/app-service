## app-service

Compose transforming, validation and actual service methods in a strict pipeline

## Installation

```
npm install app-service
```

## Usage

Define transform, validate function and actual method and wire up it through app-service

```js
var build = require('app-service');

function transformCreateUser (params) {
	console.log('transform', params);

	params.email = params.email.toLowerCase();
	return params;
}

function validateCreateUser (params) {
	console.log('validate', params):

	if (params.email.length > 100) {
		throw new Error('Email is toooo long');
	}
}

function createUser (params) {
	console.log(params);
	return 'got it!';
}

var service = build({
	methods: { createUser: createUser },
	validation: { createUser: validateCreateUser },
	transforms: { createUser: transformCreateUser }
});

service.createUser({ email: 'Johny.Dust@example.com' }).then(function (result) {
	console.log(result);
});
```

outputs:

```
transform { email: 'Johny.Dust@example.com' }
validate { email: 'johny.dust@example.com' }
{ email: 'johny.dust@example.com' }
got it!
```

## LICENSE
MIT
