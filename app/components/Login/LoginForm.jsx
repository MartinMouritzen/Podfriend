import React, { Component } from 'react';

import { connect } from "react-redux";
import { authenticateUser, authTokenReceived } from "~/app/redux/actions/userActions";

import styles from './LoginForm.css';

import SignInForm from './SignInForm.jsx';
import CreateAccountForm from './CreateAccountForm.jsx';
import PasswordForm from './PasswordForm.jsx';

import LoadingSpinner from './../Loading/LoadingSpinner.jsx';

import FacebookLogo from './../../images/social/facebook-logo.png';
import GoogleLogo from './../../images/social/google-logo.png';

function mapDispatchToProps(dispatch) {
	return {
		authTokenReceived: (token) => { dispatch(authTokenReceived(token)); },
		authenticateUser: () => { dispatch(authenticateUser()); }
	};
}

/**
*
*/
class LoginForm extends Component {
	/**
	*
	*/
	constructor(props) {
		super(props);

		
		this.state = {
			email: '',
			emailEntered: false,
			checkingEmail: false,
			creatingAccount: false,
			createdAccount: false,
			emailExists: false
		};
		/*
		this.state = {
			email: 'martin@martinmouritzen.dk',
			emailEntered: false,
			checkingEmail: false,
			creatingAccount: false,
			createdAccount: false,
			emailExists: true
		};
		*/
		/*
		this.state = {
			email: 'martin+1@martinmouritzen.dk',
			emailEntered: true,
			checkingEmail: false,
			creatingAccount: false,
			createdAccount: false
		};
		*/

		this.onUserLogin = this.onUserLogin.bind(this);
		this.__createUser = this.__createUser.bind(this);
		this.onCreateUser = this.onCreateUser.bind(this);
		this.onValidEmailEntered = this.onValidEmailEntered.bind(this);
	}
	/**
	*
	*/
	onUserLogin(token) {
		this.props.authTokenReceived(token);
		this.props.authenticateUser();
	}
	/**
	*
	*/
	onValidEmailEntered(email) {
		this.setState({
			email: email,
			checkingEmail: true,
			emailEntered: true,
			emailExists: false
		},
		() => {
			var url = "https://api.podfriend.com/user/?email=" + this.state.email;
			
			var startTime = new Date();

			return fetch(url, {
				method: "GET",
				headers: {
					'Content-Type': 'application/json',
					'Accept': 'application/json'
				}
			})
			.then((resp) => {
				return resp.json()
			})
			.then((data) => {
				var endTime = new Date();
				var timeDifference = endTime - startTime;
				
				var minimumTimeToDisplayLoading = 2500;
				var remainingTime = 0;
				
				if (timeDifference < minimumTimeToDisplayLoading) {
					remainingTime = minimumTimeToDisplayLoading - timeDifference;
				}

				setTimeout(() => {
					if (data.exists) {
						this.setState({ emailExists: true, checkingEmail: false, emailEntered: false });
					}
					else {
						this.setState({ checkingEmail: false, emailEntered: true, emailExists: false });
					}
				},remainingTime);
			});
		});
	}
	onCreateUser(username,password,email) {
		console.log('HELL YEAH - Tid til at sende en email man skal klikke på. Så checker vi på et endpoint om man har trykket på linket. (Kan man fortsætte anonymt imellemtiden?)');
		this.setState({
			creatingAccount: true,
			createdAccount: false,
			checkingEmail: false,
		},() => {
			this.__createUser(username,password,email)
			.then((response) => {
			setTimeout(() => {
				this.setState({
					creatingAccount: true,
					createdAccount: true,
					checkingEmail: false,
				});
			},100);
			});
		});
	}
	__createUser(username,password,email) {
		var url = "https://api.podfriend.com/user/";
		
		var formData = new FormData();
        formData.append('username', username);
        formData.append('password', password);
        formData.append('email', email);

		return fetch(url, {
			method: 'POST',
			headers: {
				'Accept': 'application/json'
			},
			body: formData
		})
		.then((resp) => {
			return resp.json()
		})
		.then((data) => {
			if (data.errorMessage) {
				alert('Error happened while creating user. This might not be your fault. The server returned: ' + data.errorMessage);
			}
			else {
				console.log(data);
			}
		})
		.catch((error) => {
			alert('Error happened while creating user.');
			console.log(error);
		});
	}
	/**
	*
	*/
	render() {
		var formHeight = '420px';
		if (this.state.checkingEmail) {
			formHeight = '480px';
		}
		else if (this.state.emailEntered && !this.state.checkingEmail) {
			formHeight = '520px';
		}
		
		return (
			<div className={styles.formOuter} style={{ height: formHeight }}>
				<div className={(this.state.checkingEmail || this.state.creatingAccount ? [styles.loginExplanationLoading,styles.loginExplanation].join(' ') : styles.loginExplanation)}>
					{ this.state.emailExists &&
						<React.Fragment>
							<h2>Hi friend</h2>
							<p>
								I'm super happy to see you again!
							</p>
							<p>
								Just to make sure it's you, and not some kind of weird impostor, I'll need you to verify yourself
							</p>
						</React.Fragment>
					}
					{ !this.state.creatingAccount && !this.state.emailEntered && !this.state.emailExists &&
						<React.Fragment>
							<h2>Get better podcast recommendations and listen across all your devices</h2>
							<p>
								Creating your account will literally just take a few minutes, and will be so much more enjoyable.
							</p>
						</React.Fragment>
					}
					{ this.state.creatingAccount && !this.state.createdAccount &&
						<div className={styles.loadingArea}>
							<LoadingSpinner style={{ width: '120px', margin: '0 auto', marginBottom: '50px' }} />
						
							<div className={styles.loadingText}>
								Creating account
							</div>
						</div>
					}
					{ this.state.creatingAccount && this.state.createdAccount &&
						<div className={styles.loadingArea}>
							<div className={styles.loadingText}>
								Fuck yeah
							</div>
						</div>
					}
					{ !this.state.creatingAccount && this.state.checkingEmail &&
						<div className={styles.loadingArea}>
							<LoadingSpinner style={{ width: '120px', margin: '0 auto', marginBottom: '50px' }} />
						
							<div className={styles.loadingText}>
								Let's see if you are already registered...
							</div>
						</div>
					}
					{ !this.state.creatingAccount && this.state.emailEntered && !this.state.checkingEmail &&
						<div className={styles.fadeIn3}>
							<h2>Hi, nice to meet you!</h2>
							{/*
							<p>
								Your email was not found in my database, so would you like to <span className={styles.highlight}>create an account?</span>
							</p>
							*/}
							<div>
								<p>By creating an account you will be able to:</p>
								<div className={styles.reason}>
									<div className={styles.checkmark}>✔</div>
									<div>Get <span className={styles.highlight}>tailored recommendations</span> similar to the podcasts you already know and love</div>
								</div>
								<div className={styles.reason}>
									<div className={styles.checkmark}>✔</div>
									<div>Switch devices, and <span className={styles.highlight}>continue where you left off without interruption.</span></div>
								</div>
								<div className={styles.reason}>
									<div className={styles.checkmark}>✔</div>
									<div>Share podcasts and lists with your friends and other users</div>
								</div>
							</div>
						</div>
					}
				</div>
				{ this.state.emailExists &&
					<PasswordForm onUserLogin={this.onUserLogin} email={this.state.email} />
				}
				{ !this.state.creatingAccount && !this.state.emailEntered && !this.state.emailExists &&
					<SignInForm onValidEmailEntered={this.onValidEmailEntered} email={this.state.email} />
				}
				{ !this.state.creatingAccount && this.state.emailEntered && !this.state.checkingEmail &&
					<CreateAccountForm onCreateUser={this.onCreateUser} backToSignIn={() => { this.setState({ emailEntered: false, checkingEmail: false }); }} email={this.state.email} />
				}
			</div>
		);
	}
}

const ConnectedLoginForm = connect(
	false,
	mapDispatchToProps
)(LoginForm);

export default ConnectedLoginForm;