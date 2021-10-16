# cordova-plugin-cors

Allow cross origin request (CORS) with WKWebView on iOS.

This plugin should be compatible with every plugin providing a WKWebView engine for Cordova and has been tested with [cordova-plugin-wkwebview-engine](https://github.com/apache/cordova-plugin-wkwebview-engine) and [cordova-plugin-ionic-webview](https://github.com/ionic-team/cordova-plugin-ionic-webview).

## Installation
~~~
cordova plugin add cordova-plugin-cors
~~~

## Usage
This plugin replaces the `XMLHttpRequest` object. There is no code modification required. It should work seamlessly.

It has been tested with pure Javascript code and with Angular `HttpClient` object.

Zone.js support is also integrated. Event listeners will be called within the zone used when calling `send()`.

## Example
~~~ javascript
var request = new XMLHttpRequest();
request.open('GET', 'https://cordova.apache.org', true);

request.onreadystatechange = function(event) {
    if (this.readyState === XMLHttpRequest.DONE) {
        if (this.status === 200) {
            console.info('Cross origin request was sent with success!', this.responseText);
        } else {
            console.error('Cross origin request failed :(', this.status, this.statusText);
        }
    }
};

request.send(null);
~~~

## Limitations
Synchronous requests are not supported.
