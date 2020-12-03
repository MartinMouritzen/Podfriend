var VERSION = 'podfriendv4';

var cacheFirstFiles = [
	'/app/images/checkmark_64x64.png',
	'/app/images/checkmark_inactive_64x64.png',
	'/app/images/play-button-loading.png',
	'/app/images/review-0-star.png',
	'/app/images/review-5-star.png',
	'/app/images/logo/podfriend_logo_128x128',
	'/app/images/social/facebook-logo.png',
	'/app/images/social/google-logo.png',
	'/app/images/design/blue-wave-1.svg',
	'/app/images/design/loading-hearts.svg',
	'/app/images/design/loading-rings.svg',
	'/app/images/design/player/forward.svg',
	'/app/images/design/player/rewind.svg',
	'/app/images/design/player/chromecast.svg',
	'/app/images/design/player/clock.svg',
	'/app/images/design/player/fullscreen.svg',
	'/app/images/design/player/more.svg',
	'/app/images/design/player/pause.svg',
	'/app/images/design/player/play.svg',
	'/app/images/design/player/share.svg',
	'/app/images/design/player/speed.svg',
	'/app/images/design/player/skip-backward.svg',
	'/app/images/design/player/skip-forward.svg'
];

var networkFirstFiles = [
	'/index.html',
	'/style.css',
	'/style.css.map',
	'/style.prod.js',
	'/web.prod.js'
];

// Below is the service worker code.

var cacheFiles = cacheFirstFiles.concat(networkFirstFiles);

self.addEventListener('install', event => {
	event.waitUntil(
		caches.open(VERSION).then(cache => {
			return cache.addAll(cacheFiles);
		})
	);
});

self.addEventListener('fetch', event => {
	if (event.request.method !== 'GET') {
		return;
	}
	if (networkFirstFiles.indexOf(event.request.url) !== -1) {
		event.respondWith(networkElseCache(event));
	}
	else if (cacheFirstFiles.indexOf(event.request.url) !== -1) {
		event.respondWith(cacheElseNetwork(event));
	}
	event.respondWith(fetch(event.request));
});

// If cache else network.
// For images and assets that are not critical to be fully up-to-date.
// developers.google.com/web/fundamentals/instant-and-offline/offline-cookbook/
// #cache-falling-back-to-network
function cacheElseNetwork (event) {
	return caches.match(event.request).then(response => {
		function fetchAndCache () {
			 return fetch(event.request).then(response => {
				// Update cache.
				caches.open(VERSION).then(cache => cache.put(event.request, response.clone()));
				return response;
			});
		}

		// If not exist in cache, fetch.
		if (!response) { return fetchAndCache(); }

		// If exists in cache, return from cache while updating cache in background.
		fetchAndCache();
		return response;
	});
}

// If network else cache.
// For assets we prefer to be up-to-date (i.e., JavaScript file).
function networkElseCache (event) {
	return caches.match(event.request).then(match => {
		if (!match) { return fetch(event.request); }
		return fetch(event.request).then(response => {
			// Update cache.
			caches.open(VERSION).then(cache => cache.put(event.request, response.clone()));
			return response;
		}) || response;
	});
}