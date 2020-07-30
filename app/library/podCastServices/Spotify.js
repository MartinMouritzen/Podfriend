/**
*
*/
class Spotify {
	/**
	*
	*/
	constructor(proxyCalls = false) {
		this.proxyCalls = proxyCalls;
	}
	/**
	*
	*/
	search(query) {
		return new Promise((request,resolve) => {
			return resolve([]);
		});
	}
	/**
	*
	*/
	getPodcastDetailedInformation() {
		return resolve([]);
	}
}
export default Spotify;