import React, { Component } from 'react';

import { connect } from "react-redux";

import { searchPodcasts } from "podfriend-approot/redux/actions/podcastActions";

function mapStateToProps(state,ownProps) {
	return {
		searching: state.podcast.searching,
		searchResults: state.podcast.searchResults,
		searchError: state.podcast.searchError,
		query: ownProps.searchType == 'podcast' ? ownProps.match.params.query : ownProps.match.params.author,
		authorName: ownProps.match.params.author,
		authorId: ownProps.match.params.authorId
	};
}
function mapDispatchToProps(dispatch) {
	return {
		searchPodcasts: (query,searchType,authorName,authorId) => { dispatch(searchPodcasts(query,searchType,authorName,authorId)); }
	};
}

/**
*
*/
class SearchPane extends Component {
	/**
	*
	*/
	constructor(props) {
		super(props);

		this.state = {
			selectedGenres: []
		};
		
		this.onGenreFilterChange = this.onGenreFilterChange.bind(this);
	}
	/**
	*
	*/
	onGenreFilterChange(selectedGenres) {
		this.setState({
			selectedGenres: selectedGenres && selectedGenres.length > 0 ? selectedGenres.map((option) => { return option.value; }) : []
		});
	}
	/**
	*
	*/
	render() {
		var SearchPaneUI = this.props.UI;
		return (
			<SearchPaneUI
				searching={this.props.searching}
				searchResults={this.props.searchResults}
				searchError={this.props.searchError}
				searchType={this.props.searchType}
				authorId={this.props.authorId}
				query={this.props.query}
				onGenreFilterChange={this.onGenreFilterChange}
				selectedGenres={this.state.selectedGenres}
			/>
		);
	}
	/**
	*
	*/
	componentDidMount() {
		console.log(this.props.query);
		console.log(this.props.searchType);
		console.log(this.props.authorName);
		console.log(this.props.authorId);
		this.props.searchPodcasts(this.props.query,this.props.searchType,this.props.authorName,this.props.authorId);
	}
	/**
	*
	*/
	componentDidUpdate(prevProps, prevState, snapshot) {
		if (this.props.location.pathname !== prevProps.location.pathname || this.props.query !== prevProps.query || this.props.authorId !== prevProps.authorId) {
			this.props.searchPodcasts(this.props.query,this.props.searchType,this.props.authorName,this.props.authorId);
		}
	}
}

const ConnectedSearchPane = connect(
	mapStateToProps,
	mapDispatchToProps
)(SearchPane);

export default ConnectedSearchPane;