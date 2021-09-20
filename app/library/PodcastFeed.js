import RSSFeed from './RSSFeed.js';

import XMLParser from 'fast-xml-parser';
/**
* 
*/
class PodcastFeed {
	feedUrl = this;

	__parsed = false;

	constructor (feedUrl) {
		this.feedUrl = feedUrl;
	}
	decodeXMLString = function (text) {
		if (text)  {
			return text.replace(/&apos;/g, "'")
					.replace(/&quot;/g, '"')
					.replace(/&gt;/g, '>')
					.replace(/&lt;/g, '<')
					.replace(/&amp;/g, '&');
		}
		return '';
	}
	/**
	* Converts itunes duration to seconds
	*/
	__convertDurationToSeconds(duration) {
		if (Number.isInteger(duration)) {
			return duration;
		}
		if (!duration) {
			return false;
		}
		var timePieces = duration.split(':');
		
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
		return (+timePieces[0]) * 60 * 60 + (+timePieces[1]) * 60 + (+timePieces[2]); 
	}
	async parse() {
		if (!this.feedUrl) {
			return;
		}
		console.log('parsing feed: ' + this.feedUrl);

		var response = false;
		try {
			response = await fetch(this.feedUrl);
		}
		catch  {
			response = await fetch('https://www.podfriend.com/tmp/rssproxy.php?rssUrl=' + encodeURI(this.feedUrl));
		}

		if (response) {
			var responseBody = await response.text();

			var xml = XMLParser.parse(responseBody,{
				attributeNamePrefix: '',
				ignoreAttributes: false
			});
			return this.parseContent(xml);
		}
		return false;
	}
	parseContent(xml) {
		try {
			var podcast = xml.rss.channel;

			console.log(podcast);
			
			var rssFeed = new RSSFeed();

			rssFeed.title = this.decodeXMLString(podcast.title);
			rssFeed.description = this.decodeXMLString(podcast.description);
	
			if (Array.isArray(rssFeed.link)) {
				rssFeed.link = podcast['link'][0];
				podcast['link'].shift();
				rssFeed.extraLinks = podcast['link'];
			}
			else {
				rssFeed.link = podcast['link'];
			}

			rssFeed.guid = podcast['podcast:guid'] ? podcast['podcast:guid'] : false;
			
			rssFeed.docs = podcast['docs'];
			rssFeed.generator = podcast['generator'];
			rssFeed.language = podcast['language'] ? podcast['language'] : 'en';
			rssFeed.copyright = podcast['copyright'];
			rssFeed.pubDate = podcast['pubDate'];
			rssFeed.lastBuildDate = podcast['lastBuildDate'];
			rssFeed.location = podcast['podcast:location'] ? podcast['podcast:location'] : false;
	
			rssFeed.imageUrl = podcast['image'] ? podcast['image']['url'] : false;
			rssFeed.imageTitle = podcast['image'] ? podcast['image']['title'] : false;
			rssFeed.imageWidth = podcast['image'] ? podcast['image']['width'] : false;
			rssFeed.imageHeight = podcast['image'] ? podcast['image']['height'] : false;
	
			rssFeed.managingEditor = podcast['managingEditor'];
			rssFeed.webMaster = podcast['webMaster'];
			rssFeed.locked = podcast['locked'];
	
			rssFeed.keywords = podcast['itunes:keywords'];
	
			rssFeed.summary = this.decodeXMLString(podcast['itunes:summary']);
	
			rssFeed.author = this.decodeXMLString(podcast['itunes:author']);
	
			rssFeed.explicit = podcast['itunes:explicit'];

			rssFeed.persons = podcast['podcast:person'] ? podcast['podcast:person'] : false;
			rssFeed.contacts = podcast['podcast:contact'];
			rssFeed.ids = podcast['podcast:id'];
			rssFeed.funding = podcast['podcast:funding'];
			rssFeed.images = podcast['podcast:images'];

			if (podcast['itunes:category']) {
				var categories = [];
				if (Array.isArray(podcast['itunes:category'])) {
					for(var i=0;i<podcast['itunes:category'].length;i++) {
						categories.push(podcast['itunes:category'][i].text);
					}
				}
				rssFeed.categories = categories;
			}
	
			if (podcast['itunes:owner']) {
				rssFeed.owner = podcast['itunes:owner']['itunes:name'];
				rssFeed.ownerEmail = podcast['itunes:owner']['itunes:email'];
			}
	
			let episodes = [];

			if (rssFeed.persons) {
				if (!Array.isArray(rssFeed.persons)) {
					rssFeed.persons = [ rssFeed.persons ];
				}
			}

			if (podcast.item) {
				// If there's only one item, it will not be an array, so let's turn it into one.
				if (!Array.isArray(podcast.item)) {
					podcast.item = [ podcast.item ];
				}
	
				podcast.item.forEach((episode) => {
					if (!episode['itunes:duration']) {
						episode['itunes:duration'] = '00:00';
					}
	
					episodes.push({
						uid: Math.random() * 99999999999, // We just use this to generate keys in React
						title: this.decodeXMLString(episode.title),
						summary: this.decodeXMLString(episode['itunes:summary'] ? episode['itunes:summary'] : episode['itunes:subtitle'] ? episode['itunes:subtitle'] : episode['description'] ? episode['description'] : ''),
						description: this.decodeXMLString(episode['description'] ? episode['description'] : episode['itunes:summary'] ? episode['itunes:summary'] : episode['subtitle'] ? episode['subtitle'] : ''),
						showNotes: episode['content:encoded'] ? this.decodeXMLString(episode['content:encoded']) : false,
						author: this.decodeXMLString(episode.author ? episode.author : episode['itunes:author'] ? episode['itunes:author'] : false),
						imageUrl: episode['itunes:image'] ? episode['itunes:image']['href'] : false,
						explicit: episode['itunes:explicit'],
						keywords: episode['itunes:keywords'],
						subtitle: episode['itunes:subtitle'],
						itunesSummary: episode['itunes:summary'],
						pubDate: episode.pubDate,
						date: new Date(Date.parse(episode.pubDate)),
						link: episode.link,
						guid: episode.guid ? (episode.guid['#text'] ? episode.guid['#text'] : episode.guid) : false,
						guidIsPermaLink: episode.guid ? episode.guid['isPermaLink'] === 'true' ? true : false : false,
						enclosureType: episode.enclosure ? episode.enclosure.type : '',
						enclosureLength: episode.enclosure ? episode.enclosure.length : '',
						enclosureUrl: episode.enclosure ? episode.enclosure.url : '',
						duration: this.__convertDurationToSeconds(episode['itunes:duration']),
						transcript: episode['podcast:transcript'],
						transcriptUrl: episode['podcast:transcript'] ? Array.isArray(episode['podcast:transcript']) ? episode['podcast:transcript'][0]['url'] : episode['podcast:transcript']['url'] : false,
						chaptersUrl: episode['podcast:chapters'] ? episode['podcast:chapters']['url'] : '',
						chaptersType: episode['podcast:chapters'] ? episode['podcast:chapters']['type'] : '',
						alternateEnclosures: Array.isArray(episode['podcast:alternateEnclosure']) ? episode['podcast:alternateEnclosure'] : [ episode['podcast:alternateEnclosure'] ],
						commentURL: episode['podcast:comments'] ? episode['podcast:comments'] : false
					});
				});
				rssFeed.items = episodes;
			}
			this.__parsed = true;
			return rssFeed;
		}
		catch(error) {
			console.log('Error parsing podcast feed: ' + error);
			console.log(xml);
		}
	}
}

export default PodcastFeed;