import React, { Component } from 'react';

import { connect } from "react-redux";

import { FaWindowMinimize, FaWindowRestore, FaRegWindowMaximize, FaWindowClose, FaArrowLeft, FaArrowRight } from 'react-icons/fa';

import { Link, withRouter } from 'react-router-dom';

import SearchField from 'podfriend-approot/components/Search/SearchField.jsx';
import UserTitleBar from 'podfriend-approot/components/user/userTitleBar.jsx';

import SVG from 'react-inlinesvg';

import styles from './TitleBar.scss';

function mapStateToProps(state) {
	return {
		activeEpisode: state.podcast.activeEpisode,
		isPlaying: state.audio.isPlaying
	};
}

/**
*
*/
class TitleBar extends Component {
	constructor(props) {
		super(props);
		var platform = props.platform ? props.platform : 'web';
		
		this.state = {
			platform: platform
		};
		
		this.canHistoryGo = this.canHistoryGo.bind(this);
		
		this.updateTitle();		
	}
	/**
	*
	*/
	updateTitle(episodeTitle) {
		if (this.props.activeEpisode && this.props.activeEpisode.title) {
			if (this.props.isPlaying) {
				document.title = '🔊 ' + this.props.activeEpisode.title + ' - Podfriend';
			}
			else {
				document.title = this.props.activeEpisode.title + ' - Podfriend';
			}
		}
		else {
			document.title = 'Podfriend';
		}
	}
	/**
	*
	*/
	componentDidUpdate(prevProps, prevState, snapshot) {
		if ((this.props.activeEpisode !== prevProps.activeEpisode) || this.props.isPlaying != prevProps.isPlaying) {
			this.updateTitle();
		}
		if (this.props.lastScrollDirection != prevProps.lastScrollDirection) {
			if (this.props.lastScrollDirection === 'up') {
				console.log('up1');
			}
			else {

			}
		}
	}
	canHistoryGo(number) {
		// console.log(this.props.history);
		// console.log(this.props.history.action);
		if (this.props.history.canGo) {
			return this.props.history.canGo(number);
		}
		return false;
	}
	/**
	*
	*/
	render() {
		return (
			<div className={styles.titleBar + ' appTitleBar'}>
				{ this.state.platform == 'darwin' &&
					<div className={styles.macWindowControls}>
						<div className={styles.macClose} onClick={this.props.onClose} />
						<div className={styles.macMinimize} onClick={this.props.onMinimize} />
						{ this.props.maximized &&
							<div className={styles.macMaximizeOrNormalize} onClick={this.props.onMaximizeOrNormalize}>&nbsp;</div>
						}
						{ !this.props.maximized &&
							<div className={styles.macMaximizeOrNormalize} onClick={this.props.onMaximizeOrNormalize}>&nbsp;</div>
						}
					</div>
				}
				{ this.state.platform != 'darwin' &&
					<div className={styles.logoAndTitle}>
						<Link to={'/'} style={{ display: 'block', whiteSpace: 'nowrap' }}>
							<SVG src={require('podfriend-approot/images/logo/podfriend_logo.svg')} className={styles.logo} />
						</Link>
						<Link to={'/'} className={styles.title}>
							PodFriend
						</Link>
					</div>
				}
				{/*
				<div className={styles.navigationControls}>
					<div className={(styles.navigationButtonBack + ' ') + (this.canHistoryGo(-1) ? styles.navigationButton : styles.navigationButtonDisabled)} onClick={() => { Events.emit('OnNavigateBackward',false); }}><FaArrowLeft /></div>
					<div className={(styles.navigationButtonForward + ' ') + (this.canHistoryGo(1) ? styles.navigationButton : styles.navigationButtonDisabled)} onClick={() => { Events.emit('OnNavigateForward',false); }}><FaArrowRight /></div>
				</div>
				*/ }				
				<div className={styles.search}>
					<SearchField onSearch={this.props.onSearch} />
				</div>
				<div className={styles.user}>
					<UserTitleBar />
				</div>				
				{ this.props.isElectron && this.state.platform != 'darwin' &&
					<div className={styles.windowControls}>
						<div className={styles.minimize} onClick={this.props.onMinimize}>
							<FaWindowMinimize />
						</div>
						{ this.props.maximized &&
							<div className={styles.maximizeOrNormalize} onClick={this.props.onMaximizeOrNormalize}>
								<FaWindowRestore />
							</div>
						}
						{ !this.props.maximized &&
							<div className={styles.maximizeOrNormalize} onClick={this.props.onMaximizeOrNormalize}>
								<FaRegWindowMaximize />
							</div>
						}
						<div className={styles.close} onClick={this.props.onClose}>
							<FaWindowClose />
						</div>
					</div>
				}
			</div>
		);
	}
}

const ConnectedTitleBar = withRouter(connect(
	mapStateToProps,
	null
)(TitleBar));

export default ConnectedTitleBar;