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
	static reindexActiveEpisode(activeEpisode,episodes) {
		if (!activeEpisode) {
			return false;
		}
		var episodeIndex = false;
		for(var i=0;i<episodes.length;i++) {
			if (episodes[i].url == activeEpisode.url) {
				episodeIndex = i;
				break;
			}
		}
		if (episodeIndex !== false) {
			activeEpisode.episodeIndex = episodeIndex;
		}
		return activeEpisode;
	}
	/**
	* Sort Podcast episodes by season, newest/oldest etc.
	*/
	static sortEpisodes(episodes,sortBy,sortType) {
		episodes.sort((a,b) => {
			if (sortBy === 'season') {
				var seasonA = a.season;
				var seasonB = b.season;
				
				if (seasonA == seasonB) {
					if (sortType === 'asc') {
						var sortValue = Date.parse(a.date) - Date.parse(b.date);
						if (sortValue === 0) {
							return a.title.localeCompare(b.title,{numeric: true, sensitivity: 'base'})
						}
						return sortValue;
					}
					else {
						var sortValue = Date.parse(b.date) - Date.parse(a.date);
						if (sortValue === 0) {
							return b.title.localeCompare(a.title,{numeric: true, sensitivity: 'base'})
						}
						return sortValue;
					}
				}
				else {
					if (sortType === 'asc') {
						return seasonA - seasonB;
					}
					else {
						return seasonB - seasonA;
					}
				}
			}
			else if (sortBy === 'title') {
				if (sortType === 'asc') {
					return a.title.localeCompare(b.title,undefined,{numeric: true, sensitivity: 'base'});
				}
				else {
					return b.title.localeCompare(a.title,{numeric: true, sensitivity: 'base'});
				}
			}
			else if (sortBy === 'date') {
				if (sortType === 'asc') {
					var sortValue = Date.parse(a.date) - Date.parse(b.date);
					if (sortValue === 0) {
						return a.title.localeCompare(b.title,{numeric: true, sensitivity: 'base'})
					}
					return sortValue;
				}
				else {
					var sortValue = Date.parse(b.date) - Date.parse(a.date);
					if (sortValue === 0) {
						return b.title.localeCompare(a.title,{numeric: true, sensitivity: 'base'})
					}
					return sortValue;
				}
			}
			else if (sortBy === 'duration') {
				if (sortType === 'asc') {
					return a.duration - b.duration;
				}
				else {
					return b.duration - a.duration;
				}
			}
		});
		return episodes;
	}
}
export default PodcastUtil;