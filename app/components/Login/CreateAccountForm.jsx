import React, { Component } from 'react';

import TextInput from '~/app/components/Form/TextInput.jsx';

import styles from './CreateAccountForm.css';

import CheckMark from '~/app/images/checkmark_64x64.png';
import CheckMarkInactive from '~/app/images/checkmark_inactive_64x64.png';

const TXT_ERROR_USERNAME_TOO_SHORT = 'Your username needs to be 3 or more characters long.';

/**
*
*/
class CreateAccountForm extends Component {
	/**
	*
	*/
	constructor(props) {
		super(props);

		this.state = {
			username: '',
			password: '',
			email: props.email,
			submitted: false,
			userExists: false,
			isUsernameValid: false,
			isPasswordValid: false,
			inputCounter: 0,
			passwordInputFocused: false
		};
		this.createUser = this.createUser.bind(this);
		this.createAccountSubmit = this.createAccountSubmit.bind(this);
		this.handleUsernameChange = this.handleUsernameChange.bind(this);
		this.handlePasswordChange = this.handlePasswordChange.bind(this);
		this.passwordInputFocused = this.passwordInputFocused.bind(this);
		this.passwordInputBlurred = this.passwordInputBlurred.bind(this);
		
	}
	/**
	*
	*/
	handleUsernameChange() {
		clearTimeout(this.usercheckID);
		this.setState({username: event.target.value},() => {
			if (event.target.value.length > 2) {
				this.usercheckID = setTimeout(() => {
					this.setState({ checkingUsername: true },() => {
						this.checkIfUsernameExists();
					});
				},500);
			}
			else {
				this.setState({
					userNameErrorMessage: TXT_ERROR_USERNAME_TOO_SHORT,
					isUsernameValid: false,
					checkingUsername: false
				});
			}
		});
	}	
	handlePasswordChange() {
		this.setState({
			password: event.target.value
		});
	}
	passwordInputFocused() {
		this.setState({
			passwordInputFocused: true
		});
	}
	passwordInputBlurred() {
		this.setState({
			passwordInputFocused: false
		});
	}
	/**
	*
	*/
	checkIfUsernameExists() {
		this.setState({
			checkingUsername: true
		},() => {
			var url = "https://api.podfriend.com/user/?username=" + this.state.username;

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
				if (data.exists) {
					this.setState({ userNameErrorMessage: 'Sorry, that username has already been taken.', isUsernameValid: false, userExists: true, checkingUsername: false });
				}
				else {
					this.setState({ isUsernameValid: true, userExists: false, checkingUsername: false });
				}
			});
		});
	}
	/**
	*
	*/
	createUser() {
		console.log('createuser');
		this.props.onCreateUser(this.state.username,this.state.password,this.state.email);
	}
	/**
	*
	*/
	createAccountSubmit(event) {
		console.log('createAccountSubmit');
		console.log(this.state.password);
		event.preventDefault();

		var isUsernameValid = true;
		var isPasswordValid = true;
		
		var userNameErrorMessage = '';
		var passwordErrorMessage = '';
		
		if (this.state.username.length <= 2) {
			userNameErrorMessage = TXT_ERROR_USERNAME_TOO_SHORT;
			isUsernameValid = false;
		}
		if (this.state.password.length <= 6) {
			passwordErrorMessage = 'Your password is too short. For your own security please follow the instructions to make your password more secure.';
			isPasswordValid = false;
		}
		if (!this.hasNumber(this.state.password)) {
			passwordErrorMessage = 'Your password does not contain a number. For your own security please follow the instructions to make your password more secure.';
			isPasswordValid = false;
		}
		if (!this.hasUpperCaseCharacter(this.state.password)) {
			passwordErrorMessage = 'Your password does not contain an uppercase character. For your own security please follow the instructions to make your password more secure.';
			isPasswordValid = false;
		}

		if (isUsernameValid && isPasswordValid) {
			this.createUser();
		}
		else {
			this.setState({
				submitted: true,
				userNameErrorMessage: userNameErrorMessage,
				passwordErrorMessage: passwordErrorMessage,
				isUsernameValid: isUsernameValid,
				isPasswordValid: isPasswordValid,
				inputCounter: ++this.state.inputCounter
			});
		}
	}
	hasNumber(testString) {
		return /\d/.test(testString);
	}
	hasUpperCaseCharacter(testString) {
		var lowerCaseString = testString.toLowerCase();
		if (lowerCaseString == testString) {
			return false;
		}
		else {
			return true;
		}
	}
	/**
	*
	*/
	render() {
		return (
			<div className={styles.loginForm}>
				<h2>Let's get you started</h2>
				<h3>Step 1 of 2</h3>
				<p>You are registering an account with the email <span className={styles.registeringWithEmail}>{this.state.email}</span></p>
				<p>
					<a href="#" className={styles.changeEmailLink} onClick={this.props.backToSignIn}>Would you rather use another email?</a>
				</p>
				<form onSubmit={this.createAccountSubmit}>

					<div className={styles.inputField}>
						<div className={((this.state.submitted && !this.state.isUsernameValid || this.state.userExists) ? styles.errorInInput : '')}>
							{ /* <input type="text" name="username" className={(this.state.isUsernameValid ? styles.usernameAvailable : '')} placeholder="Username" value={this.state.username} key={'username' + this.state.inputCounter} onChange={this.handleUsernameChange} /> */ }
							<TextInput id="username" type="text" placeholder="Username" className={(this.state.isUsernameValid ? styles.usernameAvailable : '')} name="username" autocomplete='username' value={this.state.username} key={'username' + this.state.inputCounter} onChange={this.handleUsernameChange} />
							{ ((this.state.submitted && !this.state.isUsernameValid) || this.state.userExists) &&
								<div className={styles.error}>
									<div className={styles.errorMessage}>
										{this.state.userNameErrorMessage}
									</div>
								</div>
							}
						</div>
						<div className={styles.usernameIsUsedFor}>
							Your username is shown if you make any of your podcast lists public, or in case you add friends, so they can recognize you.
						</div>
					</div>

					<div className={styles.inputField}>
						<div className={(this.state.submitted && !this.state.isPasswordValid ? styles.errorInInput : '')}>
							<TextInput id="password" type="password" name="password" placeholder="Password" value={this.state.password} autocomplete='current-password' key={'password' + this.state.inputCounter} onChange={this.handlePasswordChange} onFocus={this.passwordInputFocused} onBlur={this.passwordInputBlurred} />
							{ this.state.submitted && !this.state.isPasswordValid &&
								<div className={styles.error}>
									<div className={styles.errorMessage}>
										{this.state.passwordErrorMessage}
									</div>
								</div>
							}
							
							<div style={{ width: '300px', padding: '20px' }}>
								<div className={styles.passwordToolTipHeadline}>
									Password requirements
								</div>
								<div className={styles.passwordToolTipRequirement}>
									{ this.state.password.length > 6 &&
										<img src={CheckMark} className={styles.checkMark} />
									}
									{ this.state.password.length <= 6 &&
										<img src={CheckMarkInactive} className={styles.checkMarkInactive} />
									}
									<span>More than 6 characters</span>
								</div>
								<div className={styles.passwordToolTipRequirement}>
									{ this.hasNumber(this.state.password) &&
										<img src={CheckMark} className={styles.checkMark} />
									}
									{ !this.hasNumber(this.state.password) &&
										<img src={CheckMarkInactive} className={styles.checkMarkInactive} />
									}
									<span>One Number</span>
								</div>
								<div className={styles.passwordToolTipRequirement}>
									{ this.hasUpperCaseCharacter(this.state.password) &&
										<img src={CheckMark} className={styles.checkMark} />
									}
									{ !this.hasUpperCaseCharacter(this.state.password) &&
										<img src={CheckMarkInactive} className={styles.checkMarkInactive} />
									}
									<span>One uppercase character</span>
								</div>
								<div className={styles.passwordToolTipHeadline}>
									Password strength
								</div>
								<div className={styles.passwordStrengthContainer}>
									<div className={styles.passwordStrength}>&nbsp;</div>
								</div>
							</div>
							
						</div>
					</div>
					<input type="submit" value="Create your account" />
				</form>
			</div>
		);
	}
}
export default CreateAccountForm;