import React from 'react';

import { useSelector } from 'react-redux';

import SVG from 'react-inlinesvg';

import styles from './PostForm.scss';

const PostForm = () => {
	const isLoggedIn = useSelector((state) => state.user.isLoggedIn);
	const profileData = useSelector((state) => state.user.profileData);

	return (
		<div className={styles.postForm}>
			<div className={styles.userRow}>
				<div className={styles.avatarCell}>
					<SVG src={require('podfriend-approot/images/design/titlebar/userProfile.svg')} style={{ fill: '#999999', width: '40px', height: '40px' }} />
				</div>
				<div className={styles.usernameCell}>
				{ isLoggedIn &&
					<>{profileData.username}</>
				}
				{ !isLoggedIn && 
					<>
						Not logged in
					</>
				}
				</div>
			</div>
			<div>
				<div className={styles.arrowUp}></div>
				<textarea placeholder="What's on your mind?"></textarea>
				<div className={styles.buttonRow}>
					<button className='secondaryButton'>Create a post</button>
				</div>
			</div>
		</div>
	);
}
export default PostForm;