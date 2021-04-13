import React, { useState } from 'react';

import ShareF from './../../images/social/share-f.jpg';
import ShareT from './../../images/social/share-t.jpg';

import { Snackbar } from '@material-ui/core/';
import { Alert } from  '@material-ui/lab/';

import styles from './ShareButtons.css';

const ShareButtons = ({ podcastTitle, podcastPath, episodeTitle, episodeDescription = false, episodeId, timeStamp = false, shareUrl = false}) => {
	const [showCopySuccessMessage,setShowCopySuccessMessage] = useState(false);

	const shareTitle = 'Check out this episode: ' + episodeTitle + ', from the podcast ' + podcastTitle;
	const shareTitleEncoded = encodeURI(shareTitle).replace('#','%23','g');

	const shareURL = shareUrl ? shareUrl : 'https://web.podfriend.com/podcast/' + podcastPath + '/' + episodeId;
	const shareURLEncoded = encodeURI(shareUrl);

	const copyToClipBoard = (event) => {
		event.stopPropagation();

		var dummy = document.createElement("textarea");
		document.body.appendChild(dummy);
		dummy.value = shareURL;
		dummy.select();
		document.execCommand("copy");
		document.body.removeChild(dummy);
		setShowCopySuccessMessage(true);
	};

	const navigatorShare = () => {
		navigator.share({
			title: shareTitle,
			text: shareTitle,
			url: shareURL
		});
	};

	
	const onHideCopySuccessMessage = () => {
		setShowCopySuccessMessage(false);
	};

	return (
		<div className={styles.shareButtons}>
			<a href={'https://twitter.com/intent/tweet?text=' + shareTitleEncoded + '&url=' + shareURLEncoded} target="_blank" className={styles.shareButton} onClick={(event) => { event.stopPropagation(); }}>
			<img src={ShareT} width="200" height="60" alt="Share on Twitter" /></a>
			&nbsp;
			{ navigator.share && typeof window.process !== 'object' &&
				<>
					<div className={styles.clipBoardButton} onClick={(event) => { event.stopPropagation(); event.preventDefault(); navigatorShare(); }}>
						Share
					</div>
					&nbsp;
				</>
			}
			<div className={styles.clipBoardButton} onClick={copyToClipBoard}>
				Copy link
			</div>
			<Snackbar
				anchorOrigin={{
					vertical: 'bottom',
					horizontal: 'center',
				}}
				open={showCopySuccessMessage}
				autoHideDuration={3000}
				onClose={onHideCopySuccessMessage}
			>
				<Alert severity="info">Lightning invoice address copied</Alert>
			</Snackbar>
		</div>
	);
	/*
			<a href={'https://www.facebook.com/sharer/sharer.php?u=' + shareURLEncoded + '&p[title]=' + shareTitleEncoded + '&display=popup'} target="_blank" onClick={(event) => { event.stopPropagation(); }} className={styles.shareButton}>
				<img src={ShareF} width="100" height="30" alt="Share on Facebook" /></a>
			&nbsp;
	*/
}
export default ShareButtons;