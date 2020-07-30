import React from 'react';

import { Button, Icon, Text } from 'native-base';

/**
*
*/
class SubscribeButtonUI extends React.Component {
	render() {
		if (this.props.isSubscribed) {
			return (
				<Button iconLeft onPress={this.props.unsubscribeToPodcast}>
					<Icon type="FontAwesome5" name="heart-broken" />
					<Text>Remove from favorites</Text>
				</Button>
			);
		}
		else {
			return (
				<Button iconLeft onPress={this.props.subscribeToPodcast}>
					<Icon type="FontAwesome" name="heart" />
					<Text>Add to Favorites</Text>
				</Button>
			);
		}
	}
}

export default SubscribeButtonUI;