import axios from 'axios';

import XMLParser from 'fast-xml-parser';

const fetch = require('node-fetch');

/**
*
*/
class ITunes {
	/**
	*
	*/
	constructor(proxyCalls = false,proxyConfig = false) {
		this.parser = XMLParser;
		this.proxyCalls = proxyCalls;
		this.proxyConfig = proxyConfig;
	}
	/**
	*
	*/
	search(query,authorInfo = false,searchType = 'podcast') {
		var searchUrl = false;
		if (searchType == 'podcast') {
			if (this.proxyCalls) {
				searchUrl = this.proxyConfig['serverURL'] + 'search/podcast/' + encodeURIComponent(query);
			}
			else {
				searchUrl = 'https://itunes.apple.com:443/search?term=' + encodeURIComponent(query) + '&media=podcast&limit=200';
			}
		}
		else if (searchType == 'author') {
			if (this.proxyCalls) {
				searchUrl = this.proxyConfig['serverURL'] + 'search/author/?authorName=' + encodeURIComponent(authorInfo.authorName) + '&authorId=' + encodeURIComponent(authorInfo.authorId);
			}
			else {
				searchUrl = 'https://itunes.apple.com:443/lookup?id=' + encodeURIComponent(author) + '&entity=podcast&limit=200';
			}
		}
		// console.log('searching: ' + searchUrl);
		return axios({
			url: searchUrl,
			headers: { 'User-Agent': 'Podfriend Mobile 1.0' }
		})
		.then((response) => {
			if (this.proxyCalls) {
				return response.data;
			}
			let results = [];
			for (var i = 0; i < response.data.results.length; i++) {
				let resultRaw = response.data.results[i];
				
				if (resultRaw.wrapperType != 'track') {
					continue;
				}
				
				resultRaw.genres = resultRaw.genres.filter((value,index,array) => {
					return value != 'Podcasts'
				});

				var result = {
					version: 1,
					provider: 'itunes',
					providerData: {
						artistId: resultRaw.artistId,
						collectionId: resultRaw.collectionId,
						collectionId: resultRaw.collectionId
					},
					explicit: resultRaw.collectionExplicitness == 'explicit' ? true : false,
					country: resultRaw.country,
					feedUrl: resultRaw.feedUrl,
					author: resultRaw.artistName,
					name: resultRaw.name,
					artworkUrl30: resultRaw.artworkUrl30,
					artworkUrl60: resultRaw.artworkUrl60,
					artworkUrl100: resultRaw.artworkUrl100,
					artworkUrl600: resultRaw.artworkUrl600,
					primaryGenre: resultRaw.primaryGenreName,
					genres: resultRaw.genres,
					episodeCount: resultRaw.trackCount
				};
				// console.log(result);
				results.push(result);
			}
			return results;
		});
	}
	/**
	*
	*/
	getPodcastDetailedInformation(podCastInfo) {
		if (this.proxyCalls) {
			var searchUrl = this.proxyConfig['serverURL'] + 'podcast/?url=' + encodeURIComponent(podCastInfo.feedUrl);
			return axios({
				url: searchUrl
			})
			.then((response) => {
				for (var i=0;i<response.data.episodes.length;i++) {
					response.data.episodes[i].date = new Date(Date.parse(response.data.episodes[i].date));
				}
				
				return response.data;
			});
		}
		else {
			return fetch(podCastInfo.feedUrl)
			.then(res => res.text())
			.then((responseBody) => {
				var xml = this.parser.parse(responseBody,{
					attributeNamePrefix: '',
					ignoreAttributes: false
				});
				try {
					var podcast = xml.rss.channel;
					// console.log(podcast);
					
					var parsedPodcastInfo = {};
					parsedPodcastInfo.description = podcast.description;
					parsedPodcastInfo.type = podcast['itunes:type'];
					parsedPodcastInfo.link = podcast['link'];
					parsedPodcastInfo.episodes = [];
					podcast.item.forEach((episode) => {
						if (!episode['itunes:duration']) {
							episode['itunes:duration'] = '00:00';
						}

						parsedPodcastInfo.episodes.push({
							title: episode.title,
							description: episode['itunes:summary'] ? episode['itunes:summary'] : episode['itunes:subtitle'] ? episode['itunes:subtitle'] : episode['description'] ? episode['description'] : 'No description.',
							date: new Date(Date.parse(episode.pubDate)),
							type: episode.enclosure.type,
							url: episode.enclosure.url,
							duration: this.convertDurationToSeconds(episode['itunes:duration'])
						});
					});
					return parsedPodcastInfo;
				}
				catch(error) {
					console.log('Error parsing podcast: ' + error);
					return false;
				}
				
				/*
				return new Promise((resolve,reject) => {
					parsePodcast(response,(error,data) => {
						if (error) {
							return reject(error);
						}
						else {
							console.log(data);
							return resolve('');
						}
					});
				});
				*/
			});
		}
	}
	/**
	*
	*/
	convertDurationToSeconds(duration) {
		if (Number.isInteger(duration)) {
			return duration;
		}
		if (!duration) {
			return false;
		}
		var timePieces = duration.split(':');
		
		// console.log(timePieces);
		
		if (timePieces.length === 1) {
			return timePieces[0];
		}
		if (timePieces.length === 2) {
			timePieces = [
				"00",
				timePieces[0],
				timePieces[1]
			];
		}
		var result = (+timePieces[0]) * 60 * 60 + (+timePieces[1]) * 60 + (+timePieces[2]); 
		// console.log(result);
		return result;
	}
}
export default ITunes;