
module.exports = {
	production: {
		api: {
			serverURL: "https://api.podfriend.com/"
		},
		web: {
			proxyPodcastVendorRequests: true
		},
		desktop: {
			proxyPodcastVendorRequests: true
		},
		server: {
			proxyPodcastVendorRequests: true
		}
	},
	development: {
		api: {
			serverURL: "https://api.podfriend.com/"
		},
		web: {
			proxyPodcastVendorRequests: true
		},
		desktop: {
			proxyPodcastVendorRequests: true
		},
		server: {
			proxyPodcastVendorRequests: true
		}
	},
};