import React from 'react';

import ShareF from './../../images/social/share-f.jpg';
import ShareT from './../../images/social/share-t.jpg';

import styles from './ShareButtons.css';

function ShareButtons(props) {
	const shareTitle = 'Check out this episode: ' + props.episodeTitle + ', from the podcast ' + props.podcastTitle;
	const shareTitleEncoded = encodeURI(shareTitle).replace('#','%23','g');
	const shareURL = 'https://web.podfriend.com/podcast/' + props.podcastPath + '/' + props.episodeId;
	const shareURLEncoded = encodeURI('https://web.podfriend.com/podcast/' + props.podcastPath + '/' + props.episodeId);

	const copyToClipBoard = () => {
		var dummy = document.createElement("textarea");
		document.body.appendChild(dummy);
		dummy.value = shareTitle + ': ' + shareURL;
		dummy.select();
		document.execCommand("copy");
		document.body.removeChild(dummy);
	};
	return (
		<div className={styles.shareButtons}>
			<a href={'https://www.facebook.com/sharer/sharer.php?u=' + shareURLEncoded + '&p[title]=' + shareTitleEncoded + '&display=popup'} className={styles.shareButton}>
				<img src={ShareF} width="100" height="30" alt="Share on Facebook" /></a>
			&nbsp;
			<a href={'https://twitter.com/intent/tweet?text=' + shareTitleEncoded + '&url=' + shareURLEncoded} className={styles.shareButton}>
			<img src={ShareT} width="100" height="30" alt="Share on Twitter" /></a>
			&nbsp;
			<div className={styles.clipBoardButton} onClick={copyToClipBoard}>
				Copy
			</div>
		</div>
	);
}
export default ShareButtons;