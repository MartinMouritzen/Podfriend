import React, { useEffect, useState } from 'react';

import { useDispatch, useSelector } from 'react-redux';

import styles from './EpisodePane.scss';

// import Wave from 'podfriend-approot/images/design/blue-wave-1.svg';

import { Link, useParams, useHistory, useLocation } from "react-router-dom";

import PodcastImage from 'podfriend-approot/components/UI/common/PodcastImage.jsx';

import LoadingRings from 'podfriend-approot/images/design/loading-rings.svg';

import { viewPodcast, playEpisode } from "podfriend-approot/redux/actions/podcastActions";
import { showFullPlayer } from "podfriend-approot/redux/actions/uiActions";

import { FaPlay, FaPause, FaArrowLeft } from "react-icons/fa";

import { Tabs, Tab } from 'podfriend-approot/components/wwt/Tabs/Tabs.jsx';

import EpisodeChapterList from './Chapters/EpisodeChapterList.jsx';
import EpisodeChapters from './Chapters/EpisodeChapters.jsx';
import PodcastSubtitles from './Subtitles/PodcastSubtitles.jsx';
// import EpisodePlayerControls from './EpisodePlayerControls.jsx';

import DOMPurify from 'dompurify';

function useQuery() {
	return new URLSearchParams(useLocation().search);
}

const EpisodePane = () => {
	const dispatch = useDispatch();
	let { podcastName, episodeId } = useParams();

	// http://localhost:8080/podcast/someone-knows-something/499651292?t=60
	let query = useQuery();
	var timeStamp = query.get('t');

	const [episode,setEpisode] = useState(false);
	const [description,setDescription] = useState(false);
	const [chapters,setChapters] = useState(false);
	const [chaptersLoading,setChaptersLoading] = useState(true);
	const [currentChapter,setCurrentChapter] = useState(false);

	const { activeEpisode, selectedPodcast } = useSelector((state) => {
		return {
			activeEpisode: state.podcast.activeEpisode,
			selectedPodcast: state.podcast.selectedPodcast
		};
	});

	const isActiveEpisode = activeEpisode.id == episodeId;

	const onEpisodePlay = () => {
		let foundEpisode = false;
		if (selectedPodcast && selectedPodcast.episodes && selectedPodcast.episodes.length) {
			for (var i =0;i<selectedPodcast.episodes.length;i++) {
				if (selectedPodcast.episodes[i].id === episode.id) {
					foundEpisode = selectedPodcast.episodes[i];
					break;
				}
			}
		}
		if (foundEpisode) {
			dispatch(playEpisode(selectedPodcast,foundEpisode,timeStamp ? timeStamp : false));
			dispatch(showFullPlayer(true));
		}
	};

	const loadChapters = async(url) => {
		let result = false;
		try {
			result = await fetch(url);
		}
		catch(exception) {
			url = 'https://www.podfriend.com/tmp/rssproxy.php?rssUrl=' + encodeURI(url);
			result = await fetch(url);
		}
		result = await result.json();

		try {
			if (result.chapters && result.chapters.length > 0) {
				setChapters(result.chapters);
				setChaptersLoading(false);
			}
		}
		catch(exception) {
			console.log('Exception getting chapters from: ' + url);
			console.log(exception);
			setChaptersLoading(false);
		}
	};

	useEffect(() => {
		if (!isActiveEpisode) {
			return;
		}
		var foundChapter = false;

		if (activeEpisode.currentTime > 0) {
			// First we walk through to find the active chapter
			for(var i=0;i<chapters.length;i++) {
				if (chapters[i].startTime <= activeEpisode.currentTime) {
					// Let's make sure we get the latest chapter
					if (!foundChapter || foundChapter.startTime < chapters[i].startTime) {
						foundChapter = chapters[i];
					}
				}
			}
		}
		if (foundChapter !== currentChapter) {
			setCurrentChapter(foundChapter);
		}
	},[chapters,activeEpisode.currentTime]);

	useEffect(() => {
		dispatch(viewPodcast(podcastName));
		const fetchEpisodeData = async() => {
			try {
				let episode = await fetch('https://api.podfriend.com/podcast/episode/' + episodeId + '?fulltext=true');

				episode = await episode.json();

				var tempDescription = DOMPurify.sanitize(episode.description, {
					ALLOWED_TAGS: [
						'p','br','ol','ul','li','b'
					  ]
				});
				tempDescription = tempDescription.replace(/(?:\r\n|\r|\n)/g, '<br />');
				setDescription(tempDescription);
				setEpisode(episode);

				if (episode.chaptersUrl) {
					loadChapters(episode.chaptersUrl);
				}
				else {
					setChaptersLoading(false);
				}
			}
			catch (exception) {
				console.log('Exception loading episode data: ' + exception);
			}
		}
		fetchEpisodeData();
	},[episodeId]);

	let history = useHistory();

	const goToPodcast = (event) => {
		event.preventDefault();

		history.push({
			pathname: '/podcast/' + podcastName,
			search: '?clickTime=' + new Date().getMilliseconds(),
			state: {
				podcast: selectedPodcast
			}
		})
	};

	return (
		<div className={styles.episodePane}>
			<div className={styles.blueFiller}>
				<div style={{ height: '80px', overflow: 'hidden' }} >
					<svg viewBox="0 0 500 150" preserveAspectRatio="none" style={{ height: '150px', width: '100%', backgroundColor: '#0176e5' }}>
						<path d="M-0.90,34.83 C167.27,-67.79 269.41,126.60 500.78,16.08 L503.61,86.15 L-0.33,87.14 Z" style={{ stroke: 'none', fill: '#FFFFFF' }} />
					</svg>
				</div>
			</div>
			<div className={styles.podcastCoverContainer}>
				<Link className={styles.podcastTitle} to={'/podcast/' + podcastName} onClick={goToPodcast}>
					<FaArrowLeft style={{ fill: '#FFFFFF', position: 'relative', top: 2, marginRight: 5 }}  /> { episode ? 'Back to ' + episode.feedTitle : 'Back to podcast' }
				</Link>
				<div className={styles.coverHolder}>
					{ chapters &&
						<EpisodeChapters chapters={chapters} progress={isActiveEpisode ? activeEpisode.currentTime : 0} />
					}

					<Link to={'/podcast/' + podcastName} onClick={goToPodcast}>
						<PodcastImage
							podcastPath={podcastName}
							imageErrorText={episode.title}
							width={600}
							height={600}
							src={episode.image ? episode.image : episode.feedImage}
							fallBackImage={episode.feedImage}
							className={styles.podcastCover}
							draggable="false"
							loadingComponent={() => { return ( <div className={styles.loadingCover}><img src={LoadingRings} /></div> ) }}
						/>
						</Link>
				</div>
			</div>
			<div className={styles.episodeInfo}>
			{ episode !== false && isActiveEpisode &&
					<PodcastSubtitles episode={episode} progress={activeEpisode.currentTime} tempPodcast={selectedPodcast} />
				}
				<div className={styles.episodeTitle}>
					{episode.title}
				</div>

				{ selectedPodcast !== false && episode !== false && 
					<>
						{ !isActiveEpisode &&
							<div onClick={onEpisodePlay} className={'button ' + styles.playButton}>
									<FaPlay /> Play this episode
							</div>
						}
						{ isActiveEpisode &&
							<div onClick={onEpisodePlay} className={'button ' + styles.playButton}>
									<FaPlay /> Resume this episode
							</div>
						}
					</>
				}
				<Tabs>
					<Tab title="Description" active link={'/podcast/' + podcastName + '/' + episode.id }>
						<div className={styles.description} dangerouslySetInnerHTML={{__html:description}} /> 
					</Tab>
					{/*
					<Tab title="Chat" active link={'/podcast/' + selectedPodcast.path + '/' + episode.id + '/chat/' }>
						<ChatPane roomId={episodeId} />
					</Tab>
					*/}
					{ chaptersLoading === true &&
						<Tab title={'Loading Chapters'} active link={'/podcast/' + podcastName + '/' + episode.id + '/chapters/' }>
							Loading Chapters
						</Tab>
					}
					{ chapters !== false &&
						<Tab title="Chapters" active link={'/podcast/' + podcastName + '/' + episode.id + '/chapters/' }>
							<EpisodeChapterList chapters={chapters} currentChapter={currentChapter} />
						</Tab>
					}
				</Tabs>
			</div>
		</div>
	);
};

export default EpisodePane;