class PodcastUtil {
	/**
	*
	*/
	static generatePodcastUrl(podcastName) {
		if (!podcastName) {
			return '';
		}
		podcastName = podcastName.replace(/ /g,'_');
		return podcastName;
	}
}
export default PodcastUtil;