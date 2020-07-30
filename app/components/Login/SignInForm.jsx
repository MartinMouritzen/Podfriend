import React, { Component } from 'react';

import TextInput from '~/app/components/Form/TextInput.jsx';

import styles from './SignInForm.css';

import FacebookLogo from './../../images/social/facebook-logo.png';
import GoogleLogo from './../../images/social/google-logo.png';

/**
*
*/
class SignInForm extends Component {
	/**
	*
	*/
	constructor(props) {
		super(props);

		this.state = {
			email: props.email,
			invalidEmail: false,
			emailCounter: 0
		};
		this.handleEmailChange = this.handleEmailChange.bind(this);
		this.continueWithEmail = this.continueWithEmail.bind(this);
	}
	/**
	*
	*/
	handleEmailChange(event) {
		this.setState({email: event.target.value});
	}
	/**
	*
	*/
	continueWithEmail(event) {
		event.preventDefault();
		const emailRegexp = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

		var isEmailValid = emailRegexp.test(this.state.email);
		
		if (isEmailValid) {
			this.props.onValidEmailEntered(this.state.email);
		}
		else {
			this.setState({
				invalidEmail: true,
				emailCounter: ++this.state.emailCounter
			});
		}
	}
	/**
	*
	*/
	render() {
		return (
			<div className={styles.loginForm}>
				<h2>Sign in or register with</h2>
				<div>
					<div className={styles.socialMediaButton}>
						<img src={FacebookLogo} />
						<div className={styles.facebook}>Facebook</div>
					</div>
					<div className={styles.socialMediaButton}>
						<img src={GoogleLogo} />
						<div className={styles.google}>Google</div>
					</div>
					
				</div>
				<div className={styles.orLine}>
					<div className={styles.orLineHR}>
						<hr />
					</div>
					<div className={styles.orLineOr}>
						or
					</div>
					<div className={styles.orLineHR}>
						<hr />
					</div>
				</div>
				<h3>Use your email address</h3>

				<form onSubmit={this.continueWithEmail}>
					{ /* this.state.invalidEmail &&
						<div className={styles.error}>
							<div className={styles.errorMessage}>
								The email you entered seems to be invalid
							</div>
						</div>
					*/ }

					
					<div className={styles.inputField}>
						<div className={(this.state.invalidEmail ? styles.errorInInput : '')}>
							{ /* <input type="text" name="username" className={(this.state.isUsernameValid ? styles.usernameAvailable : '')} placeholder="Username" value={this.state.username} key={'username' + this.state.inputCounter} onChange={this.handleUsernameChange} /> */ }
							<TextInput id="email" name="email" type="email" placeholder="Email address" value={this.state.email} key={'username' + this.state.emailCounter} onChange={this.handleEmailChange} />
							{ this.props.emailErrorMessage &&
								<div className={styles.error}>
									<div className={styles.errorMessage}>
										{this.props.emailErrorMessage}
									</div>
								</div>
							}
						</div>
					</div>
					
					<input type="submit" value="Continue with email" />
				</form>
			</div>
		);
	}
}
export default SignInForm;