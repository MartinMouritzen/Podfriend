import React, { Component } from 'react';

import { connect } from "react-redux";
import { userLogout } from "~/app/redux/actions/userActions";
import { initiateLogin } from "~/app/redux/actions/uiActions";

import { Link, withRouter } from 'react-router-alias';

import { FaRegEnvelope, FaPlus, FaUser, FaHome, FaPodcast, FaRegLightbulb, FaLightbulb,  FaFolder, FaRegClock } from "react-icons/fa";

import { IonToggle } from '@ionic/react';


/*
import Switch from '@material-ui/core/Switch';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
*/

// import Toggle from 'react-toggle';
// import "react-toggle/style.css";

import PodcastList from 'podfriend-approot/components/PodcastList/PodcastList.jsx';

/* import CategoryList from './CategoryList/CategoryList.jsx'; */

import FavoriteList from '../Favorites/FavoriteList.jsx';
import FavoriteListUI from '../Favorites/FavoriteListUI.jsx';

import WalletBalance from 'podfriend-approot/components/Wallet/WalletBalance.jsx';

import styles from './SideBar.scss';

function mapStateToProps(state) {
	return {
		isLoggedIn: state.user.isLoggedIn,
		subscribedPodcasts: state.podcast.subscribedPodcasts,
		selectedPodcast: state.podcast.selectedPodcast,
		activePodcast: state.podcast.activePodcast,
		value4ValueEnabled: state.settings.value4ValueEnabled
	};
}

function mapDispatchToProps(dispatch) {
	return {
		initiateLogin: () => { dispatch(initiateLogin()); }
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
		if (this.state.hasArchivedPodcasts == hasArchived) {
			return;
		}
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
						<div className={styles.categoryList}>

							<Link to="/" className={styles.mainNavigationButton}>
								<FaHome size="20" /> Home
							</Link>
							<Link to="/podfrndr/" className={styles.mainNavigationButton}>
								<FaRegLightbulb size="20" /> Podfrndr
							</Link>
							{ this.props.isLoggedIn === false &&
								<div className={styles.mainNavigationButton} onClick={this.props.initiateLogin}>
									<FaUser size="20" /> Log in
								</div>
							}
							{ false && this.props.isLoggedIn === true &&
								<div className={styles.mainNavigationButton}>
									<FaUser size="20" /> Account
								</div>
							}
							{ false && 
								<Link to="/podcasters/" className={styles.mainNavigationButton}>
									<FaPodcast size="20" /> For Podcasters
								</Link>
							}
							{ true && 
								<Link to="/contact/" className={styles.mainNavigationButton}>
									<FaRegEnvelope size="20" /> Contact us
								</Link>
							}
							<hr />
							<PodcastList />
							{ /*
							<hr />

							<div className={styles.mainNavigationButton}>
								<Link to="/favorites/">
									<FaPodcast size="20" /> Favorites
								</Link>
							</div>
							

							<CategoryList
								
							/>

							<div className={styles.mainNavigationButton}>
								<FaFolder size="20" /> Uncategorized
							</div>
							<div className={styles.mainNavigationButton}>
								<FaRegClock size="20" /> Recent podcasts
							</div>

							
							<div className={styles.addMoreButton}><FaPlus size="12" /> Add new category</div>

							*/ }
						</div>
						{ this.props.isLoggedIn === true &&
							<WalletBalance />
						}
					</div>
					<div className={styles.podcasts}>
						<div className={styles.podcastHeader}>Podcasts</div>
						<div className={styles.podcastList}>
							<FavoriteList UI={FavoriteListUI} showArchived={this.state.showArchived} setHasArchived={this.setHasArchived} />
						</div>
						<div className={styles.filter + ' ' + (this.state.hasArchivedPodcasts ?  styles.filterTrue : styles.filterFalse)}>
							<IonToggle checked={this.state.showArchived} onIonChange={this.handleShowArchivedChange} />
							<div className={styles.filterLabel}>
								Show archived podcasts
							</div>
						</div>
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