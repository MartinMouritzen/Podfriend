# A jsonp adapter for axios

## support promise，support cancel，same as xhr

## install

```script
npm install axios-jsonp
```

## usage

```script
let axios = require('axios');
let jsonpAdapter = require('axios-jsonp');

axios({
    url: '/jsonp',
    adapter: jsonpAdapter,
    callbackParamName: 'c' // optional, 'callback' by default
}).then((res) => {

});
```