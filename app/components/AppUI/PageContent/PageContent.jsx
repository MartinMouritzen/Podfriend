import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';

import styles from './PageContent.scss';

const PageContent = ({ children, onContentScrollChange, headerHeight = 0 }) => {
	const contentRef = useRef(null);

	const [scrollPosition,setScrollPosition] = useState(0);

	useEffect(() => {
		const onScroll = () => {
			onContentScrollChange(contentRef.current.scrollTop);
		};
		if (contentRef && contentRef.current) {
			contentRef.current.addEventListener('scroll', onScroll);
			return () => {
				contentRef.current.removeEventListener('scroll', onScroll);
			}
		}
	},[]);

	return (
		<div className={styles.pageContent} ref={contentRef} style={{ height: 'calc(100% - ' + headerHeight + 'px)'}} >
			{ children }
		</div>
	);
};
export default PageContent;