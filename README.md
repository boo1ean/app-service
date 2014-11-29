## app-service

Part of app-helpers project.

Simple wiring up of app-validation with service methods through naming conventions.

## Installation

```
npm install app-service
```

## Usage

Validate function should has same name in validation object as target method.

```javascript
function before () {
	console.log('before');
}

function validateUsefulMethod () {
	console.log('validate');
}

function usefulMethod () {
	console.log('useful method');
}

function after () {
	console.log('after');
}

var methods = { usefulMethod: usefulMethod };
var validation = { usefulMethod: validateUsefulMethod };

var service = s({
	methods: methods,
	validation: validation,
	before: before,
	after: after
});

service.usefulMethod().then(function () {
	console.log('done');
});

// before
// validation
// useful method
// after
// done
```

todo

## LICENSE
MIT
