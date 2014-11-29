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

function validation () {
	console.log('validate');
}

function usefulMethod () {
	console.log('useful method');
}

function after () {
	console.log('after');
}

var methods = { usefulMethod: usefulMethod };
var validation = { usefulMethod: validate };

var service = s({
	methods: methods,
	validation: validation,
	before: before,
	after: after
});

service.usefulMethod();
// before
// validation
// useful method
// after
```

todo

## LICENSE
MIT
