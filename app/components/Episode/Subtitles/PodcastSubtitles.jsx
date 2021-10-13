import React, { useEffect, useState } from 'react';

import XMLParser from 'fast-xml-parser';

import parseSRT from 'parse-srt';

import DOMPurify from 'dompurify';

import SubtitleSearchModal from 'podfriend-approot/components/Episode/Subtitles/SubtitleSearchModal.jsx';

import Modal from 'podfriend-approot/components/AppUI/Modal';

import styles from './PodcastSubtitles.scss';

const PodcastSubtitles = React.memo(({ progress, url, tempPodcast = false, episode = false, subtitleFileURL = false, episodeOpen = false, searchOpen = false, onTranscriptSearchClose }) => {
	// This part is temporary until the podcast index supports having transcripts and subtitles in the index.
	const [feedUrl,setFeedUrl] = useState(false);

	const [searching,setSearching] = useState(false);

	const [subtitleContent,setSubtitleContent] = useState(false);

	useEffect(() => {
		setSearching(searchOpen);
	},[searchOpen]);

	const parseSubtitleFile = async(type,subtitleFile) => {
		fetch(subtitleFile)
		.catch((exception) => {
			return fetch('https://www.podfriend.com/tmp/rssproxy.php?rssUrl=' + encodeURI(subtitleFile));
		})
		.then((result) => {
			if (type === 'application/json') {
				return result.json();
			}
			return result.text();
		})
		.then((result) => {
			if (type === 'application/srt' || type === 'text/srt') {
				var srtResult = parseSRT(result);
				setSubtitleContent(srtResult);
			}
			else {
				// setSubtitleContent(result);
			}
		})
		.catch((exception) => {
			console.log('Could not fetch subtitle file: ' + exception);
			console.log(subtitleFile);
		});
	};

	const parseFeed = async() => {
		console.log('parsing feed: ' + feedUrl);

		var response = false;
		try {
			response = await fetch(feedUrl);
		}
		catch  {
			response = await fetch('https://www.podfriend.com/tmp/rssproxy.php?rssUrl=' + encodeURI(feedUrl));
		}

		if (response) {
			var responseBody = await response.text();

			var xml = XMLParser.parse(responseBody,{
				attributeNamePrefix: '',
				ignoreAttributes: false
			});
			try {
				var podcast = xml.rss.channel;
				var foundEpisode = false;

				podcast.item.forEach((podcastFeedEpisode) => {
					if ((episode.guid && podcastFeedEpisode['guid'] && episode.guid === podcastFeedEpisode['guid']['#text']) || podcastFeedEpisode['enclosure']['url'] === episode.enclosureUrl) {
						foundEpisode = true;
						var transcriptTags = podcastFeedEpisode['podcast:transcript'];

						var useTranscript = transcriptTags;
						if (useTranscript && useTranscript.length) {
							for (var i=0;i< transcriptTags.length;i++) {
								/*
								if (transcriptTags[i].type === 'application/json') {
									useTranscript = transcriptTags[i];
									break;
								}
								*/
								if (transcriptTags[i].type === 'application/srt') {
									useTranscript = transcriptTags[i];
									break;
								}
							}
						}
						if (useTranscript) {
							parseSubtitleFile(useTranscript.type,useTranscript.url);
						}
					}
				});
				if (!foundEpisode) {
					// console.log('Did not find episode in feed');
				}
			}
			catch(error) {
				console.log('Error parsing podcast feed: ' + error);
				console.log(xml);
			}
		}
	};

	useEffect(() => {
		setSubtitleContent(false);
		try {
			var re = /(?:\.([^.]+))?$/;
			var ext = re.exec(subtitleFileURL)[1];
			if (ext === 'srt') {
				parseSubtitleFile('text/srt',subtitleFileURL);
			}
		}
		catch(exception) {
			console.log('Error parsing subtitles: ' + exception);
		}
	},[subtitleFileURL]);

	useEffect(() => {
		if (!feedUrl || !episode) {
			return;
		}
		parseFeed();
	},[episode, feedUrl]);

	useEffect(() => {
		if (searching && !episodeOpen) {
			setSearching(false);
		}
	},[episodeOpen]);
	
	useEffect(() => {
		if (!episode || !tempPodcast) {
			return;
		}
		setFeedUrl(tempPodcast.feedUrl);
	},[tempPodcast.path]);


	if (subtitleContent && progress) {
		if (true) {
			let useText = [];
			for(var i=0;i<subtitleContent.length;i++) {
				if (progress > subtitleContent[i].start && progress < subtitleContent[i].end) {
					useText.push(subtitleContent[i]);
				}
			}
			return (
				<div className={styles.subtitleContainer}>
					<div className={styles.subtitles}>
						{ useText.map((segment) => {
							var cleanText = DOMPurify.sanitize(segment.text,{
								ALLOWED_TAGS: ['br']
							});
							return (
								<div className={styles.subtitleLine} key={segment.id} dangerouslySetInnerHTML={{__html:cleanText}} />
							)
						}) }
					</div>
					{ searching &&
						<Modal shown={searching} onClose={() => { setSearching(false); onTranscriptSearchClose(); }}>
							<SubtitleSearchModal subtitleContent={subtitleContent} />
						</Modal>
					}
				</div>
			);
		}
		if (false) { // This is for application/json
			let useText = [];
			for(var i=0;i<subtitleContent.segments.length;i++) {
				var segment = subtitleContent.segments[i];
				if (progress > segment.start_time && progress < segment.end_time) {
					useText.push(segment);
				}
			}
			if (useText.length > 0) {
				return (
					<div className={styles.subtitles}>
						{ useText.map((segment) => {
							return (
								<div className={styles.subtitleLine} key={segment.body}>
									{segment.body}
								</div>
							)
						}) }
					</div>
				);
			}
		}
	}
	return null;
});

export default PodcastSubtitles;