import React from 'react';

import Notice from './Notice.jsx';

const Warning = ({ style, title, children, targetClass, targetPlatform }) => {
	return (
		<Notice
			type="warning"
			style={style}
			title={title}
			targetClass={targetClass}
			targetPlatform={targetPlatform}
		>
			{children}
		</Notice>
	);
};
export default Warning;