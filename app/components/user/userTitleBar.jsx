import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';

import { connect } from "react-redux";
import { initiateLogin } from "~/app/redux/actions/userActions";

import { ContextMenu, ContextMenuItem } from "~/app/components/wwt/ContextMenu/ContextMenu";

import { FaUser, FaCog, FaComment, FaLock } from "react-icons/fa";

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
		initiateLogin: () => { dispatch(initiateLogin()); }
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
		this.state = {
			loggedIn: false,
			menuShown: false
		};
		
		this.onMenuHide = this.onMenuHide.bind(this);
		this.invertMenu = this.invertMenu.bind(this);
		this.handleLoginClick = this.handleLoginClick.bind(this);
	}
	/**
	*
	*/
	handleLoginClick() {
		console.log('handle login');
	}
	/**
	*
	*/
	onMenuHide() {
		this.setState({
			menuShown: false
		});
	}
	/**
	*
	*/
	invertMenu() {
		this.setState({
			menuShown: !this.state.menuShown
		});
	}
	/**
	*
	*/
	render() {
		return (
			<div className={styles.username}>
				{ !this.props.isLoggedIn &&
					<div onClick={this.props.initiateLogin}>
						Create a user or log in yeah
					</div>
				}
				{ this.props.isLoggedIn &&
					<div id="username" onClick={this.invertMenu}>
						{this.props.profileData.username}
					</div>
				}
				{ this.state.menuShown &&
					<ContextMenu onMenuHide={this.onMenuHide}>
						<ContextMenuItem><Link to='/account/'><FaUser />Account</Link></ContextMenuItem>
						<ContextMenuItem><Link to='/feedback/'><FaComment />Give feedback</Link></ContextMenuItem>
						<ContextMenuItem><Link to='/settings/'><FaCog />Settings</Link></ContextMenuItem>
						<ContextMenuItem><Link to='/logout/'><FaLock />Log out</Link></ContextMenuItem>
						
					</ContextMenu>
				}
			</div>
		);
	}
	/**
	*
	*/
	handleChange(event) {
		this.setState({
			value: event.target.value
		});
	}
}
const connectedUserTitleBar = withRouter(connect(
	mapStateToProps,
	mapDispatchToProps
)(UserTitleBar));

export default connectedUserTitleBar;