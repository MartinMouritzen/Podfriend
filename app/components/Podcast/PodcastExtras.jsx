import React from 'react';

import styles from './PodcastExtras.css';

const PodcastExtras = ({isSubscribed, isArchived, selectedPodcast,subscribedPodcasts,subscribeToPodcast,unsubscribeToPodcast, podcastLoading, archivePodcast, unarchivePodcast}) => {
	let isArchiveTooltipActive = false;

	const showTooltip = () => {

	};
	const hideTooltip = () => {

	};

	return (
		<div className={styles.PodcastExtras}>

			<SubscribeButton
				isSubscribed={isSubscribed}
				selectedPodcast={selectedPodcast}
				subscribedPodcasts={subscribedPodcasts}
				subscribeToPodcast={subscribeToPodcast}
				unsubscribeToPodcast={unsubscribeToPodcast}
			/>
			
			{ !podcastLoading && !isArchived && isSubscribed &&
				<div className={styles.archiveButton} id="archiveButton" onClick={() => { archivePodcast(selectedPodcast); }} onMouseEnter={showTooltip)} onMouseLeave={hideTooltip}>
					<FaArchive /> Archive podcast
					<ToolTip show={isArchiveTooltipActive} position="bottom center" static={true} arrowAlign="center" textBoxWidth="400px" moveDown="5px">
						<div className={styles.toolTipText}>
							<p>This will keep the podcast in your favorites, but you have to show archived podcasts to see it.</p>
							<p>It's a great way to keep your lists nice and clean.</p>
						</div>
					</ToolTip>
				</div>
			}
			{ !podcastLoading && isArchived && isSubscribed &&
				<div
					className={styles.archiveButton}
					id="archiveButton"
					onClick={() => {
						unarchivePodcast(selectedPodcast);
					}}
					onMouseEnter={this.showTooltip.bind(this)}
					onMouseLeave={this.hideTooltip.bind(this)}>
						<FaArchive /> Unarchive podcast
				</div>
			}
		</div>
	);
};

export default PodcastExtras;