## app-service

Part of app-helpers project.

Simple wiring up of app-validation with service methods through naming conventions.

## Installation

```
npm install app-service
```

## Usage

When using app-service there is convention that service methods always take data object as first argument.

```javascript
// Users service

var v = require('app-validation');
var s = require('app-service');
var users = require('../storage/users');

var validation = {
	create: v({
		email: ['required', 'email'],
		password: ['required', 'strong password']
	})
};

var service = {
	create: function create (data) {
		return users.create(data);
	}
};

module.exports = s(service, validation);
```

And now use the service

```javascript
var users = require('./services/users');
users.create({ email: 'sample@example.com', password: 'test', password_repeat: 'test' });
```

User service's create method will be executed only if input data object passes `create` validator

## LICENSE
MIT
