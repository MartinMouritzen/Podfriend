/**
* A Javascript representation of a RSS Feed
*/
class RSSFeed {
	title = '';
	description = '';

	docs = '';
	link = '';
	language = 'en';
	copyright = '';

	managingEditor = '';
	editorEmail = '';
	webMaster = '';
	owner = false;
	ownerEmail = false;

	pubDate = false;
	lastBuildDate = false;

	imageUrl = false;

	categories = false;

	items = [];

	generateXML() {
		var xml = '';

		xml += this.generatePodcastInfoXML();
		xml += this.generatePodcastItemXML();

		return xml;
	}
	/**
	* @preview boolean If true, will cut things like description to 100 chars.
	*/
	generatePodcastInfoXML(preview = false) {
		let code = '';
		code += '<rss xmlns:itunes="http://www.itunes.com/dtds/podcast-1.0.dtd" xmlns:podcast="https://github.com/Podcastindex-org/podcast-namespace/blob/main/docs/1.0.md" version="2.0">\n';
		code += '\t<channel>\n';
			code += `\t\t<title>${this.encodeXMLString(this.title)}</title>\n`;

			if (this.description) {
				if (preview) {
					code += `\t\t<description>${this.encodeXMLString(this.description.length > 100 ? this.description.substring(0,100) + ' [long text hidden in preview].' : this.description)}</description>\n`;
				}
				else {
					code += `\t\t<description>${this.encodeXMLString(this.description)}</description>\n`;
				}
			}
			if (this.summary) {
				code += `\t\t<itunes:summary>${this.summary}</itunes:summary>\n`;
			}

			if (this.link) {
				code += `\t\t<link>${this.link}</link>\n`;
			}
			if (Array.isArray(this.extraLinks)) {
				for(var i=0;i<this.extraLinks.length;i++) {
					code += `\t\t<link`;
					for (const [key, value] of Object.entries(this.extraLinks[i])) {
						code += ` ${key}=${value}`;
					}
					code += `>\n`;
				}
			}
			if (this.docs) {
				code += `\t\t<docs>${this.encodeXMLString(this.docs)}</docs>\n`;
			}
			if (this.language) {
				code += `\t\t<language>${this.encodeXMLString(this.language)}</language>\n`;
			}
			code += `\t\t<generator>Podcast Index RSS Builder</generator>\n`;

			if (this.pubDate) {
				code += `\t\t<pubDate>${this.encodeXMLString(this.pubDate)}</pubDate>\n`;
			}
			if (this.lastBuildDate) {
				code += `\t\t<lastBuildDate>${this.encodeXMLString(this.lastBuildDate)}</lastBuildDate>\n`;
			}
			
			if (this.copyright) {
				code += `\t\t<copyright>${this.encodeXMLString(this.copyright)}</copyright>\n`;
			}
			if (this.managingEditor) {
				code += `\t\t<managingEditor>${this.encodeXMLString(this.managingEditor)}</managingEditor>\n`;
			}
			if (this.webMaster) {
				code += `\t\t<webMaster>${this.encodeXMLString(this.webMaster)}</webMaster>\n`;
			}
			if (this.author) {
				code += `\t\t<itunes:author>${this.encodeXMLString(this.author)}</itunes:author>\n`;
			}
			if (this.owner || this.ownerEmail) {
				code += '\t\t<itunes:owner>\n';
				if (this.owner) {
					code += `\t\t\t<itunes:name>${this.encodeXMLString(this.owner)}</itunes:name>\n`;
				}
				if (this.ownerEmail) {
					code += `\t\t\t<itunes:email>${this.encodeXMLString(this.ownerEmail)}</itunes:email>\n`;
				}
				code += '\t\t</itunes:owner>\n';
			}

			if (this.keywords) {
				code += `\t\t<itunes:keywords>${this.encodeXMLString(this.keywords)}</itunes:keywords>\n`;
			}

			if (this.imageUrl) {
				code += `\t\t<image>\n`;
					code += `\t\t\t<url>${this.encodeXMLString(this.imageUrl)}</url>\n`;
					if (this.imageTitle) {
						code += `\t\t\t<title>${this.encodeXMLString(this.imageTitle)}</title>\n`;
					}
					if (this.imageWidth) {
						code += `\t\t\t<width>${this.imageWidth}</width>\n`;
					}
					if (this.imageHeight) {
						code += `\t\t\t<height>${this.imageHeight}</height>\n`;
					}
				code += `\t\t</image>\n`;
				code += `\t\t<itunes:image href="${this.imageUrl}" />\n`;
			}

			if (this.explicit) {
				code += `\t\t<itunes:explicit>${this.explicit}</itunes:explicit>\n`;
			}

			if (this.categories) {
				for(var z=0;z<this.categories.length;z++) {
					code += `\t\t<itunes:category text="${this.categories[z]}" />\n`;
				}
			}
/*
			console.log(this.persons);

			if (this.persons) {
				if (!Array.isArray(this.persons)) {
					this.persons = [this.persons];
				}
				this.persons.forEach((person) => {
					code += '\t\t<podcast:person>';
					code += person;
					code += '</podcast:person>\n';
				});
			}
			if (this.contacts) {

			}
			if (this.ids) {

			}
			if (this.funding) {

			}
			if (this.images) {

			}
*/
/*
			rssFeed.persons = podcast['podcast:person'];
			rssFeed.contacts = podcast['podcast:contact'];
			rssFeed.ids = podcast['podcast:id'];
			rssFeed.funding = podcast['podcast:funding'];
			rssFeed.images = podcast['podcast:images'];
			*/

			code += this.generatePodcastItemsXML(preview);

			code += '\t</channel>\n';
			code += '</rss>';
		return code;
	}
	/**
	*
	*/
	supportsComments() {
		for (var i=0;i<this.items.length;i++) {
			if (this.items[i].commentObject) {
				return true;
			}
		}
		return false;
	}
	/**
	*
	*/
	generatePodcastItemsXML(preview) {
		return this.items.map((item,index) => {
			return this.generatePodcastItemXML(item,preview);
		}).join('');
	}
	addEpisodeLine(item,tagName,attributeName = tagName) {
		if (item[attributeName]) {
			return `\t\t\t<${tagName}>${this.encodeXMLString(item[attributeName])}</${tagName}>\n`;
		}
		else {
			return '';
		}
	}
	encodeXMLString(text) {
		  return text.replace(/&/g, '&amp;')
					 .replace(/</g, '&lt;')
					 .replace(/>/g, '&gt;')
					 .replace(/"/g, '&quot;')
					 .replace(/'/g, '&apos;');
	}
	/**
	*
	*/
	generatePodcastItemXML(item, preview) {
		let code = '';
		code += '\t\t<item>\n';
			code += this.addEpisodeLine(item,'title');

			if (item.description && item.description.length) {
				if (preview) {
					code += `\t\t\t<description>${this.encodeXMLString(item.description.length > 100 ? item.description.substring(0,100) + ' [long text hidden in preview].' : item.description)}</description>\n`;
					code += `\t\t\t<itunes:summary>${this.encodeXMLString(item.description.length > 100 ? item.description.substring(0,100) + ' [long text hidden in preview].' : item.description)}</itunes:summary>\n`;
				}
				else {
					code += `\t\t\t<description>${this.encodeXMLString(item.description)}</description>\n`;
					code += `\t\t\t<itunes:summary>${this.encodeXMLString(item.description)}</itunes:summary>\n`;
				}
			}
			code += this.addEpisodeLine(item,'link');
			code += this.addEpisodeLine(item,'itunes:subtitle','subtitle');

			if (item.imageUrl) {
				code += `\t\t\t<itunes:image href="${item.imageUrl}" />\n`;
			}
			

			if (item.enclosureUrl) {
				code += `\t\t\t<enclosure url="${item.enclosureUrl}"`;
					if (item.enclosureLength) {
						code += ` length="${item.enclosureLength}"`;
					}
					if (item.enclosureType) {
						code += ` type="${item.enclosureType}"`;
					}
				code += ' />\n';
			}
			if (item.guid) {
				code += '\t\t\t<guid';
				if (item.guidIsPermaLink) {
					code += ' isPermaLink="true"';
				}
				code += `>${item.guid}</guid>\n`;
			}
			// code += this.addEpisodeLine(item,'pubDate');

			if (item.date) {
				code += `\t\t\t<pubDate>${item.date.toUTCString()}</pubDate>\n`;
			}
			else if (item.pubDate) {
				code += this.addEpisodeLine(item,'pubDate','pubDate');
			}

			if (item.chaptersUrl) {
				code += `\t\t\t<podcast:chapters url="${item.chaptersUrl}" type="application/json" />\n`;
			}

			// If there is more than one transcript, let's bail. We don't support that right now.
			if (Array.isArray(item.transcript)) {
				var transcripts = item.transcript;
				if (!Array.isArray(item.transcript)) {
					transcripts = [ item.transcript ];
				}
				transcripts.forEach((transcript) => {
					code += `\t\t\t<podcast:transcript url="${transcript.url}" type="${transcript.type}" />\n`;
				});
			}
			else if (item.transcriptUrl) {
				var re = /(?:\.([^.]+))?$/;
				var transcriptExtension = re.exec(item.transcriptUrl)[1];

				var mimeTypes = {
					srt: 'text/srt',
					json: 'text/json',
					html: 'text/html'
				};
				var relTypes = {
					srt: 'captions',
					json: 'captions',
					html: 'transcript'
				};
				var mimeType = mimeTypes[transcriptExtension] ? mimeTypes[transcriptExtension] : 'text/html';
				var relType = relTypes[transcriptExtension] ? relTypes[transcriptExtension] : 'transcript';
				code += `\t\t\t<podcast:transcript url="${item.transcriptUrl}" type="${mimeType}" rel="${relType} "/>\n`;
			}


			code += this.addEpisodeLine(item,'itunes:explicit','explicit');
			code += this.addEpisodeLine(item,'itunes:keywords','keywords');

			code += this.addEpisodeLine(item,'author','author');
			code += this.addEpisodeLine(item,'itunes:author','author');

		code += '\t\t</item>\n';
		return code;
	}
}
export default RSSFeed;