import React from 'react';

class Avatar extends React.PureComponent {
	render() {
		return (
			<img
				src={'https://api.podfriend.com/user/avatar/' + this.props.userGuid + '.jpg?t'}
				style={{
					width: '45px',
					height: '45px',
					borderRadius: '5px'
				}}
			/>
		);
	}
}
export default Avatar;