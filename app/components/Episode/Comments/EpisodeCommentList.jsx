import React, { useEffect, useState } from 'react';

import DOMPurify from 'dompurify';

import ActivityPub from 'podfriend-approot/library/ActivityPub/ActivityPub.js';
import styles from './EpisodeCommentList.scss';


const EpisodeComment = ({ from, content }) => {
	const [commentText,setCommentText] = useState('Loading comment.');

	useEffect(() => {
		setCommentText(DOMPurify.sanitize(content,{
			ALLOWED_TAGS: [] // we used to allow 'i','em', but it doesn't work on mobile. I'm not sure I can see a good reason to have them.
		}));
	},[]);

	return (
		<div className={styles.comment}>
			<img src={from.avatar} className={styles.avatar} />
			<div className={styles.commentContent}>
				<div className={styles.username}>{from.username}</div>
				<div className={styles.commentText}>
					{commentText}
				</div>
			</div>
		</div>
	);
};
const EpisodeCommentList = ({ commentURL }) => {
	const [commentInfo,setCommentInfo] = useState(false);
	const [comments,setComments] = useState([]);

	useEffect(() => {
		const retrieveCommentInformation = (commentURL) => {
			console.log('RSS has Comment URL: ');
			console.log(commentURL);

			ActivityPub.getCommentInformation(commentURL.uri)
			.then((commentResponse) => {
				setCommentInfo(commentResponse);
			})
			.catch((error) => {
				console.log('error getting comments: ');
				console.log(error);
			});
		};

		if (commentURL) {
			retrieveCommentInformation(commentURL);
		}
	},[commentURL]);

	useEffect(() => {
		if (commentInfo) {
			const retrieveComments = () => {
				console.log('retrieveComments()');
				return ActivityPub.getComments(commentInfo,0)
				.then((comments) => {
					console.log('comments');
					console.log(comments);
					setComments(comments);
				});
			};
			retrieveComments();
		}
	},[commentInfo]);


	return (
		<div className={styles.commentList}>
			{ Array.isArray(comments) === false && 
				<div>
					No comments yet for this episode.
				</div>
			}
			{ Array.isArray(comments) && comments.map((comment,index) => {
				console.log('comment: ');
				console.log(comment);
				return <EpisodeComment key={index} from={comment.from} content={comment.content} />;
			})}
			<div className={styles.writeCommentContainer}>
				<textarea className={styles.writeComment} placeholder="How do you feel about this episode?"></textarea>
				<button>Post comment</button>
			</div>
		</div>
	);
};
export default EpisodeCommentList;