var iTunesDriver = require('./podCastServices/ITunes.js').default;

/**
*
*/
class PodCastService {
	/**
	*
	*/
	constructor(driverName,proxyCalls = false,proxyConfig = false) {
		this.loadDriver(driverName,proxyCalls,proxyConfig);
	}
	/**
	*
	*/
	loadDriver(driverName,proxyCalls,proxyConfig) {
		// var DriverClass = require('./PodCastServices/' + driverName + '.js').default;
		var DriverClass = iTunesDriver;
		this.driver = new DriverClass(proxyCalls,proxyConfig);
	}
	/**
	*
	*/
	search(query,authorId = false,searchType = 'podcast') {
		return this.driver.search(query,authorId,searchType);
	}
	/**
	*
	*/
	getPodcastDetailedInformation(podCastInfo) {
		return this.driver.getPodcastDetailedInformation(podCastInfo);
	}
}
export default PodCastService;