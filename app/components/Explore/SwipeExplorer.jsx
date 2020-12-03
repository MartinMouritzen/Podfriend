import React, { useEffect, useState, useRef } from 'react';

import styles from './SwipeExplorer.css';

import SwipeCard from './SwipeCard.jsx';

import SwipeCategoryFilter from './SwipeCategoryFilter.jsx';

import LoadingHearts from 'podfriend-approot/images/design/loading-hearts.svg';

import { useDispatch } from 'react-redux';
import { subscribeToPodcast } from "podfriend-approot/redux/actions/podcastActions";

const SwipeExplorer = () => {
	const dispatch = useDispatch();

	const audioElement = useRef(null);
	const [episodes,setEpisodes] = useState(false);
	const [lastDirection, setLastDirection] = useState();

	const getNewEpisodeList = () => {
		fetch('https://api.podfriend.com/podcast/random/?count=5')
		.then((response) => { return response.json(); })
		.then((results) => {
			if (results.episodes) {
				setEpisodes(results.episodes);
			}
		});
	};

	useEffect(() => {
		getNewEpisodeList();
	},[]);
  
	const swiped = (direction,episodeId) => {
		setLastDirection(direction);

		if (direction === 'right') {
			let podcast = false;
			for(var i=0;i<episodes.length;i++) {
				if (episodes[i].id === episodeId) {
					podcast = episodes[i];
					break;
				}
			}
			if (podcast) {
				console.log(podcast);
/*
artworkUrl30: "https://podnews.net/static/podnews-2000x2000.png"
artworkUrl60: "https://podnews.net/static/podnews-2000x2000.png"
artworkUrl100: "https://podnews.net/static/podnews-2000x2000.png"
artworkUrl600: "https://podnews.net/static/podnews-2000x2000.png"
author: "Podnews LLC"
description: "Daily news about the global podcasting and on-demand audio industry. Curated by James Cridland editor@podnews.net - visit podnews.net to subscribe to our free newsletter for all the links and more"
feedUrl: "https://podnews.net/rss"
guid: "DBA72288-C9D5-4E99-8BE3-915866E8"
hideListenedEpisodes: true
image: "https://podnews.net/static/podnews-2000x2000.png"
language: "en"
link: "https://podnews.net"
name: "Podnews podcasting news"
onlySeason: "all"
parentguid: ""
path: "podnews-podcasting-news"
receivedFromServer: "2020-10-11T16:52:16.942Z"
sortBy: "date"
sortType: "desc"
type: null
*/
				const subscribePodcastInfo = {
					name: podcast.feedTitle,
					guid: podcast.guid,
					path: podcast.path,
					author: podcast.author,
					feedUrl: podcast.feedUrl,
					receivedFromServer: new Date(),
					type: null,
					description: podcast.description,
					image: podcast.feedImage,
					artworkUrl30: podcast.feedImage,
					artworkUrl60: podcast.feedImage,
					artworkUrl100: podcast.feedImage,
					artworkUrl600: podcast.feedImage,
				};
				console.log(subscribePodcastInfo);
				dispatch(subscribeToPodcast(subscribePodcastInfo));
			}
		}
		
		if (episodeId === episodes[0].id) {
			getNewEpisodeList();
		}
	}
  
	const outOfFrame = (episodeId) => {
		console.log(episodeId + ' left the screen!')
	}

	const playAudio = (audioUrl) => {
		try {
			if (audioElement.current.src === audioUrl) {
				audioElement.current.play();
			}
			else {
				audioElement.current.src = audioUrl;
				audioElement.current.pause();
				audioElement.current.play();
			}
		}
		catch (exception) {
			console.log('Exception playing audio: ' + exception);
		}
	};
	const stopAudio = () => {
		try {
			audioElement.current.pause();
		}
		catch (exception) {
			console.log('Exception pausing audio: ' + exception);
		}
	};

	return (
		<div className={styles.swipeExplorer}>
			<audio
				ref={audioElement}
				style={{ display: 'none' }}
				preload="auto"
				controls={false}
			/>
			{ !episodes &&
				<div>
					<div style={{ marginBottom: 10 }}>
						<img src={LoadingHearts} />
					</div>
					<div>
						Loading your future loves
					</div>
				</div>
			}
			{ episodes &&
				<div className={styles.cardContainer}>
					<div className={styles.swipe}>
						<div className={styles.rootCard}>
							<div style={{ marginBottom: 10 }}>
								<img src={LoadingHearts} />
							</div>
							<div>
								Loading more potential podflirts, just for you!
							</div>
						</div>
					</div>
					{ episodes && episodes.map((episode,index) => {
						return (
							<SwipeCard
								key={episode.id}
								swiped={swiped}
								outOfFrame={outOfFrame}
								episode={episode}
								index={index}
								playAudio={playAudio}
								stopAudio={stopAudio}
							/>
						)
					} ) }
				</div>
			}
			{ /*
			<SwipeCategoryFilter />
			*/ }
		</div>
	);
};
export default SwipeExplorer;