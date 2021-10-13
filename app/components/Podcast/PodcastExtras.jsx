import React from 'react';

import { FaArchive } from "react-icons/fa";
import SubscribeButton from './SubscribeButton.jsx';

import isElectron from 'is-electron';

import SVG from 'react-inlinesvg';
const DonateIcon = () => <SVG src={require('podfriend-approot/images/design/podcastpane/creditcard.svg')} />;

import styles from './PodcastExtras.css';

const PodcastExtras = React.memo(({isSubscribed, isArchived, selectedPodcast,subscribedPodcasts,subscribeToPodcast,unsubscribeToPodcast, podcastLoading, archivePodcast, unarchivePodcast}) => {
	let isArchiveTooltipActive = false;

	const showTooltip = () => {

	};
	const hideTooltip = () => {

	};

	const goToFundingUrl = () => {
		if (isElectron()) {
			var shell = require('electron').shell;
			shell.openExternal(selectedPodcast.funding.url);
		}
		else {
			window.open(selectedPodcast.funding.url,"_blank");
		}
	};

	return (
		<div className={styles.podcastExtras}>
			<div className={styles.subscribe}>
				<SubscribeButton
					isSubscribed={isSubscribed}
					selectedPodcast={selectedPodcast}
					subscribedPodcasts={subscribedPodcasts}
					subscribeToPodcast={subscribeToPodcast}
					unsubscribeToPodcast={unsubscribeToPodcast}
				/>
				
				{ !podcastLoading && !isArchived && isSubscribed &&
					<div className={styles.archiveButton} id="archiveButton" onClick={() => { archivePodcast(selectedPodcast); }}>
						<FaArchive /> Archive podcast
						{ /*
						<div show={isArchiveTooltipActive} position="bottom center" static={true} arrowAlign="center" textBoxWidth="400px" moveDown="5px">
							<div className={styles.toolTipText}>
								<p>This will keep the podcast in your favorites, but you have to show archived podcasts to see it.</p>
								<p>It's a great way to keep your lists nice and clean.</p>
							</div>
						</div>
						*/ }
					</div>
				}
				{ !podcastLoading && isArchived && isSubscribed &&
					<div
						className={styles.archiveButton}
						id="archiveButton"
						onClick={() => {
							unarchivePodcast(selectedPodcast);
						}}
						>
							<FaArchive /> Unarchive podcast
					</div>
				}
				{ selectedPodcast.funding && selectedPodcast.funding.url &&
					<button className={'podfriendButton ' + styles.donateButton} onClick={goToFundingUrl}><DonateIcon /> Donate to podcast</button>
				}
			</div>
			<div className={styles.share}>
				<div className={styles.headline}>Share this podcast</div>
			</div>
		</div>
	);
});

export default PodcastExtras;