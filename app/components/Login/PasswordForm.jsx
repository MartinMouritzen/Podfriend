import React, { Component } from 'react';

import TextInput from '~/app/components/Form/TextInput.jsx';

import CheckMark from '~/app/images/checkmark_64x64.png';
import CheckMarkInactive from '~/app/images/checkmark_inactive_64x64.png';

import styles from './PasswordForm.css';

/**
*
*/
class PasswordForm extends Component {
	/**
	*
	*/
	constructor(props) {
		super(props);

		this.state = {
			password: '',
			invalidPassword: false,
			inputCounter: 0,
			forgotPasswordInitiated: false
		};
		this.handlePasswordChange = this.handlePasswordChange.bind(this);
		this.login = this.login.bind(this);
		this.forgotPassword = this.forgotPassword.bind(this);
	}
	/**
	*
	*/
	handlePasswordChange(event) {
		this.setState({password: event.target.value});
	}
	/**
	*
	*/
	login(event) {
		event.preventDefault();

		var url = "https://api.podfriend.com/authenticate/";
		
		var formData = new FormData();
        formData.append('password', this.state.password);
        formData.append('email', this.props.email);
        
        console.log('posting user credentials');

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
			if (data.error) {
				console.log('Error logging in: ' + data.error);
				this.setState({
					invalidPassword: true,
					passwordErrorMessage: 'Sorry, that\'s not the password you typed when you created the account',
					inputCounter: ++this.state.inputCounter
				});
			}
			else {
				if (data.token) {
					this.props.onUserLogin(data.token);					
				}
				else {
					alert('Error happened while logging in, this is probably not your fault. Please try again later.');
					console.log('No token returned when logging in');
				}
			}
		})
		.catch((error) => {
			alert('Error happened while logging in, this is probably not your fault. Please try again later.');
			console.log(error);
		});
	}
	/**
	*
	*/
	forgotPassword(event) {
		event.preventDefault();

		this.setState({
			forgotPasswordInitiated: true
		},() => {
			var url = "https://api.podfriend.com/user/reset-password/?email=" + this.props.email;

			fetch(url);
		});
	}
	/**
	*
	*/
	render() {
		return (
			<div className={styles.loginForm}>
				<h2>Let's get listening!</h2>
				<p>Your email: {this.props.email}</p>
				<form onSubmit={this.login}>
					<div className={styles.inputField}>
						<div className={(this.state.invalidPassword ? styles.errorInInput : '')}>
							<TextInput id="password" type="password" name="password" placeholder="Password" value={this.state.password} key={'password' + this.state.inputCounter} onChange={this.handlePasswordChange} onFocus={() => { this.setState({ passwordInputFocused: true }); } } onBlur={() => { this.setState({ passwordInputFocused: false }); } } />
							{ this.state.invalidPassword &&
								<div className={styles.error}>
									<div className={styles.errorMessage}>
										{this.state.passwordErrorMessage}
									</div>
								</div>
							}
						</div>
					</div>
					
					<input type="submit" value="Log in" />

					{ this.state.forgotPasswordInitiated === false && 
						<div style={{ marginTop: '20px' }}>
							<a href="#" onClick={this.forgotPassword}>... I forgot my password</a>
						</div>
					}
					{ this.state.forgotPasswordInitiated === true && 
						<div style={{ marginTop: '20px', marginBottom: '20px' }}>
							<div style={{ fontWeight: 'bold', marginBottom: '5px' }}>Do not despair my friend!</div>
							<div style={{ lineHeight: '25px' }} >An email has been sent to <span style={{ fontWeight: 'bold' }}>{this.props.email}</span>, with instructions for resetting your password.</div>
						</div>
					}

					<div style={{ width: '300px', padding: this.state.passwordInputFocused ? '20px' : '0px', height: this.state.passwordInputFocused ? 'auto' : '0px', overflow: 'hidden', transition: 'all 0.4s' }}>
						<div className={styles.passwordToolTipHeadline}>
							Password hints
						</div>
						<div className={styles.passwordToolTipRequirement}><span>More than 6 characters</span></div>
						<div className={styles.passwordToolTipRequirement}><span>At least one number</span></div>
						<div className={styles.passwordToolTipRequirement}><span>At least one uppercase character</span></div>
					</div>

				</form>
			</div>
		);
	}
}
export default PasswordForm;