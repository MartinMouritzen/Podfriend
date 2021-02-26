/**
* Podcast Wallet
*/
class PodcastWallet {
	constructor() {

	}
	/**
	*
	*/
	static sendValue(valueBlock) {
		console.log('sendValue: ' + valueBlock);
		console.log(valueBlock);

		if (valueBlock.model && valueBlock.model.type === 'lightning') {
			if (valueBlock.model.method === 'keysend') {
				
			}
		}
	}
}
export default PodcastWallet;