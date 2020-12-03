import React from 'react';

import { connect } from "react-redux";

import { Link, withRouter } from 'react-router-alias';

function mapStateToProps(state) {
	return {
		subscribedPodcasts: state.podcast.subscribedPodcasts,
		selectedPodcast: state.podcast.selectedPodcast,
		activePodcast: state.podcast.activePodcast
	};
}

function mapDispatchToProps(dispatch) {
	return {
		
	};
}


class FavoriteList extends React.Component {
	/**
	*
	*/
	constructor(props) {
		super(props);
		
		this.state = {
			subscribedPodcasts: this.__sort(props.subscribedPodcasts,'name','asc'),
			orderBy: 'name',
			orderType: 'asc',
		};
		
		this.__sort = this.__sort.bind(this);
		this.sortBy = this.sortBy.bind(this);
		this.checkArchiveStatus = this.checkArchiveStatus.bind(this);
	}
	checkArchiveStatus() {
		var hasArchivedPodcast = false;
		if (this.props.setHasArchived) {
			this.props.subscribedPodcasts.map((podcast) => {
				if (podcast.archived) {
					hasArchivedPodcast = true;
				}
			});
			if (hasArchivedPodcast) {
				this.props.setHasArchived(hasArchivedPodcast);
			}
		}
	}
	componentDidMount() {
		this.checkArchiveStatus();
	}
	/**
	*
	*/
	__sort(podcasts,orderBy,orderType) {
		if (!podcasts) { return false; }
		
		return podcasts;
		
		podcasts.sort((a,b) => {
			if (orderBy === 'name') {
				if (orderType === 'asc') {
					return a.name.localeCompare(b.name);
				}
				else {
					return b.name.localeCompare(a.name);
				}
			}
			else if (orderBy === 'date') {
				if (orderType === 'asc') {
					var sortValue = a.date - b.date;
					if (sortValue === 0) {
						return a.name.localeCompare(b.name)
					}
					return sortValue;
				}
				else {
					var sortValue = b.date - a.date;
					if (sortValue === 0) {
						return b.name.localeCompare(a.name)
					}
					return sortValue;
				}
			}
			else if (orderBy === 'added') {
				if (orderType === 'asc') {
					return a.dateSubscribed - b.dateSubscribed;
				}
				else {
					return b.dateSubscribed - a.dateSubscribed;
				}
			}
		});
		return podcasts;
	}
	/**
	*
	*/
	componentDidUpdate(prevProps, prevState, snapshot) {
		if (this.props.subscribedPodcasts !== prevProps.subscribedPodcasts) {
			this.checkArchiveStatus();
			this.setState({
				subscribedPodcasts: this.__sort(this.props.subscribedPodcasts,'name','asc'),
			});
		}
	}
	/**
	*
	*/
	sortBy(type) {
		var sortedPodcasts = this.state.subscribedPodcasts;
		var newOrderBy = type;
		var newOrderType = this.state.orderBy !== newOrderBy ? 'asc' : this.state.orderType === 'asc' ? 'desc' : 'asc';

		sortedPodcasts = this.__sort(this.state.subscribedPodcasts,newOrderBy,newOrderType);
		
		this.setState({
			subscribedPodcasts: sortedPodcasts,
			orderBy: newOrderBy,
			orderType: newOrderType
		});
	}
	render() {
		const FavoriteListUI = this.props.UI;

		return (
			<FavoriteListUI
				showResponsiveList={this.props.showResponsiveList}
				showArchived={this.props.showArchived}
				subscribedPodcasts={this.state.subscribedPodcasts}
				activePodcast={this.props.activePodcast}
			/>
		);
	}
}

const ConnectedFavoriteList = withRouter(connect(
	mapStateToProps,
	mapDispatchToProps
)(FavoriteList));

export default ConnectedFavoriteList;