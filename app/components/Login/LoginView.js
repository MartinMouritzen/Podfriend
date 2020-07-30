import React, { Component } from 'react';

/**
*
*/
class LoginView extends Component {
	/**
	*
	*/
	constructor(props) {
		super(props);
		
		this.myApiOauth = props.googleAuth;
		
		this.state = {
			
		};
		
		this.handleLogin = this.handleLogin.bind(this);
	}
	/**
	*
	*/
	render() {
		return (
			<div onClick={this.handleLogin}>
				Press here to login to Google
			</div>
		);
	}
	/**
	*
	*/
	handleLogin() {
		this.myApiOauth.openAuthWindowAndGetTokens()
		.then((token) => {
			this.props.onGoogleLogIn(token);
		})
		.catch((exception) => {
			alert('error: ' + exception);
		});
	}
}
export default LoginView;