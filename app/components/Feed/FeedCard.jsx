import React, { useEffect } from 'react';

import PodcastImage from 'podfriend-approot/components/UI/common/PodcastImage.jsx';

import SVG from 'react-inlinesvg';
// const BoostIcon = () => <SVG src={require('podfriend-approot/images/design/icons/boost.svg')} />;
const LikeIcon = () => <SVG src={require('podfriend-approot/images/design/icons/like.svg')} />;
const CommentIcon = () => <SVG src={require('podfriend-approot/images/design/icons/comment.svg')} />;
const ShareIcon = () => <SVG src={require('podfriend-approot/images/design/icons/share.svg')} />;

import styles from './FeedCard.scss';

const FeedCard = ({ fromName, fromImage, contentText, footerTitle, whenDate, children }) => {
	/*
	return (
		<div className={styles.card + ' ' + styles.card1}>
			<div className={styles.cardPreview}>
				{children}
			</div>
			<div className={styles.cardContent}>
				<div className={styles.cardHeader}>
					{fromImage}
					<div className={styles.cardHeaderText}>
						<div className={styles.fromName}>{fromName}</div>
						<div className={styles.whenDate}>{whenDate}</div>
					</div>
				</div>
				<div className={styles.contentText}>
					{contentText}
				</div>
				<div className={styles.cardFooter}>
					<div className={styles.socialFooter}>
						<div className={styles.likeButton}>
							Like
						</div>
						<div className={styles.commentButton}>
							Comment
						</div>
						<div className={styles.shareButton}>
							Share
						</div>
					</div>
				</div>
			</div>
		</div>
	);
	*/
	return (
		<div className={styles.card + ' ' + styles.card1}>
			<div className={styles.cardHeader}>
				{fromImage}
				<div className={styles.cardHeaderText}>
					<div className={styles.fromName}>{fromName}</div>
					<div className={styles.whenDate}>{whenDate}</div>
				</div>
			</div>
			<div className={styles.cardContent}>
				{children}
			</div>
			<div className={styles.cardFooter}>
				<div className={styles.footerTitle}>
					{footerTitle}
				</div>
				<div className={styles.socialFooter}>
					<div className={styles.likeButton}>
						<LikeIcon /> <span>Like</span>
					</div>
					<div className={styles.commentButton}>
						<CommentIcon /> <span>Comment</span>
					</div>
					<div className={styles.shareButton}>
						<ShareIcon /> <span>Share</span>
					</div>
				</div>
			</div>
		</div>
	);
}
export default FeedCard;