import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';

import { connect } from "react-redux";
import { userLogout } from "~/app/redux/actions/userActions";
import { initiateLogin, showWalletModal } from "~/app/redux/actions/uiActions";

import { ContextMenu, ContextMenuItem } from "~/app/components/wwt/ContextMenu/ContextMenu";

import { FaRegEnvelope, FaWallet, FaUser, FaCog, FaComment, FaLock } from "react-icons/fa";

import SVG from 'react-inlinesvg';

import styles from './userTitleBar.css';

/**
*
*/
function mapStateToProps(state) {
	return {
		isLoggedIn: state.user.isLoggedIn,
		profileData: state.user.profileData
	};
}
function mapDispatchToProps(dispatch) {
	return {
		initiateLogin: () => { dispatch(initiateLogin()); },
		userLogout: () => { dispatch(userLogout()); },
		showWalletModal: () => { dispatch(showWalletModal()); }
	};
}

/**
*
*/
class UserTitleBar extends Component {
	/**
	*
	*/
	constructor(props) {
		super(props);
		this.usernameRef = React.createRef();
	}
	/**
	*
	*/
	render() {
		return (
			<div className={styles.username}>
				{ !this.props.isLoggedIn &&
					<div onClick={this.props.initiateLogin} className={styles.loginSection}>
						<SVG src={require('podfriend-approot/images/design/titlebar/userProfile.svg')} style={{ fill: '#FFFFFF', width: '30px', height: '30px' }} />
					</div>
				}
				{ this.props.isLoggedIn &&
					<>
						<div className={styles.username} onClick={this.invertMenu} ref={this.usernameRef}>
							{this.props.profileData.username}
						</div>
						<ContextMenu element={this.usernameRef} showTrigger="click" position="bottom">
							{/*
							<ContextMenuItem><Link to='/account/'><FaUser />Account</Link></ContextMenuItem>
							<ContextMenuItem><Link to='/feedback/'><FaComment />Give feedback</Link></ContextMenuItem>
							
							<ContextMenuItem><Link to='/settings/'><FaCog />Settings</Link></ContextMenuItem>
							*/}
							<ContextMenuItem onClick={this.props.showWalletModal}><FaWallet />Podcast Wallet</ContextMenuItem>
							<ContextMenuItem><Link to='/contact/'><FaRegEnvelope />Contact us</Link></ContextMenuItem>
							<ContextMenuItem onClick={this.props.userLogout}><FaLock />Log out</ContextMenuItem>
						</ContextMenu>
					</>
				}
			</div>
		);
	}
}
const connectedUserTitleBar = withRouter(connect(
	mapStateToProps,
	mapDispatchToProps
)(UserTitleBar));

export default connectedUserTitleBar;