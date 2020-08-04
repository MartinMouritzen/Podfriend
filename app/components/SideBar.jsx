import React, { Component } from 'react';

import { connect } from "react-redux";


import { Link, withRouter } from 'react-router-alias';

// import * as FontAwesomeIcons from "react-icons/fa";

import {FaPlus} from "react-icons/fa";
// import * as GamerIcons from "react-icons/gi";

import Toggle from 'react-toggle';

import CategoryList from './CategoryList/CategoryList.jsx';

import FavoriteList from './Favorites/FavoriteList.jsx';
import FavoriteListUI from './Favorites/FavoriteListUI.jsx';

import styles from './SideBar.css';

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

/**
*
*/
class SideBar extends Component {
	constructor(props) {
		super(props);
		
		this.state = {
			hasArchivedPodcasts: false,
			showArchived: false,
			focused: false
		};

		this.handleShowArchivedChange = this.handleShowArchivedChange.bind(this);
		this.onFocusClick = this.onFocusClick.bind(this);
		this.setHasArchived = this.setHasArchived.bind(this);
	}
	/**
	*
	*/
	handleShowArchivedChange() {
		this.setState({
			showArchived: !this.state.showArchived
		});
	}
	/**
	*
	*/
	onFocusClick() {
		this.setState({
			focused: true
		});
	}
	setHasArchived(hasArchived) {
		this.setState({
			hasArchivedPodcasts: hasArchived
		});
	}
	/**
	*
	*/
	render() {
		return (
			<div className={styles.sideBar} onClick={this.onFocusClick}>
				<div className={styles.panes}>
					<div className={styles.categories}>
					
					{
						<div className={styles.categoryList}>
							<CategoryList />

							
							<div className={styles.addMoreButton}><FaPlus size="12" /> Add new category</div>
						</div>
					}
					</div>
					<div className={styles.podcasts}>
						<div className={styles.podcastHeader}>Podcasts</div>
						<div className={styles.podcastList}>
							<FavoriteList UI={FavoriteListUI} showArchived={this.state.showArchived} setHasArchived={this.setHasArchived} />
						</div>
						{ this.state.hasArchivedPodcasts &&
							<div className={styles.filter}>
								<div>
									<Toggle
									  id='archived-status'
									  defaultChecked={this.state.showArchived}
									  icons={{ checked: null, unchecked: null }}
									  onChange={this.handleShowArchivedChange} />
									<label htmlFor='cheese-status'>Show archived podcasts</label>
								</div>
							</div>
						}
					</div>
				</div>
			</div>
		);
	}
}


const ConnectedSideBar = withRouter(connect(
	mapStateToProps,
	mapDispatchToProps
)(SideBar));

export default ConnectedSideBar;

// export default withRouter(SideBar);