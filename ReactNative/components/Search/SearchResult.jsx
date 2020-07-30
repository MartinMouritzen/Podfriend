import React from 'react';

import { connect } from "react-redux";
import { subscribeToPodcast, unsubscribeToPodcast } from "podfriend-approot/redux/actions/index";

import { View, Image, StyleSheet } from 'react-native';
import { Text } from 'native-base';

import { Link } from 'react-router-native';

function mapStateToProps(state) {
	return {
		subscribedPodcasts: state.podcast.subscribedPodcasts
	};
}

function mapDispatchToProps(dispatch) {
	return {
		subscribeToPodcast: (podcast) => { dispatch(subscribeToPodcast(podcast)); },
		unsubscribeToPodcast: (podcast) => { dispatch(unsubscribeToPodcast(podcast)); }
	};
}

const styles = StyleSheet.create({
	thumbnail: {
		width: 100,
		height: 100,
		borderWidth: 1,
		borderColor: '#EEEEEE'
	}
});

class SearchResult extends React.Component {
	constructor(props) {
		super(props);
	}
	render() {
		return (
			<Link to={{
				pathname: '/podcast/' + this.props.result.path,
				state: {
					podcast: this.props.result
				}
			}}>
				<View style={{ flexDirection: 'row', margin: 10, marginLeft: 0 }}>
					<Image style={styles.thumbnail} source={{ uri: this.props.result.artworkUrl100 }} />
					<View style={{ padding: 10, paddingTop: 0 }}>
						<Text>{this.props.result.author}</Text>
						<Text>{this.props.result.name}</Text>
					</View>
				</View>
			</Link>
		);
	}
	/*	
	render() {
		return (
			<Link to={{
					pathname: '/podcast/' + this.props.result.path,
					state: {
						podcast: this.props.result
					}
				}} className={styles.searchResult}>
				<div style={{ backgroundImage: 'url(' + this.props.result.artworkUrl600 + ')' }} className={styles.thumbNail}>
					{ !isSubscribed &&
						<div className={styles.subscribe} onClick={(event) => { event.preventDefault(); event.stopPropagation(); this.props.subscribeToPodcast(this.props.result);  }}>
							<FaHeart />
						</div>
					}
					{ isSubscribed &&
						<div className={styles.unSubscribe} onClick={(event) => { event.preventDefault(); event.stopPropagation(); this.props.unsubscribeToPodcast(this.props.result); }}>
							<FaHeartBroken />
						</div>
					}					
				</div>
				<div className={styles.content}>
					<div className={styles.author}>
						{this.props.result.author}
					</div>
					<div className={styles.title}>
						{this.props.result.name}
					</div>
					<div className={styles.tags}>
					
					</div>
				</div>
			</Link>
		);
	}
	*/
}

const ConnectedSearchResult = connect(
	mapStateToProps,
	mapDispatchToProps
)(SearchResult);

export default ConnectedSearchResult;