import React, { useState, useEffect } from 'react';

import PodcastPage from 'podfriend-approot/components/Page/PodcastPage.jsx';

import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper';

import Alert from '@material-ui/lab/Alert';

import Button from '@material-ui/core/Button';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';

import { useSelector, useDispatch } from 'react-redux';

import { FaFacebookSquare, FaTwitterSquare, FaMastodon } from "react-icons/fa";

const contactReasons = [
	'I would like to report a bug',
	'I would like to request a feature',
	'I have general feedback',
	'My podcast is on Podfriend and I want it to be taken down',
	'Other'
];

const ContactForm = ({ success, setSuccess }) => {
	const dispatch = useDispatch();

	const isLoggedIn = useSelector((state) => state.user.isLoggedIn);
	const profileData = useSelector((state) => state.user.profileData);

	const [contactReason,setContactReason] = useState('');

	const [valueName,setValueName] = useState('');
	const [valueEmail,setValueEmail] = useState((isLoggedIn ? profileData.email : ''));
	const [valueMessage,setValueMessage] = useState('');
	const [errorMessage,setErrorMessage] = useState(false);

	/*
	useEffect(() => {

	},[]);
	*/

	const sendForm = (event) => {
		setErrorMessage(false);

		event.preventDefault();

		var url = "https://api.podfriend.com/contact/";
		
		var formData = new FormData();
        formData.append('name', valueName);
        formData.append('email', valueEmail);
		formData.append('reason', contactReason);
		formData.append('message', valueMessage);
        
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
				console.log('Error posting message: ' + data.error);
				setErrorMessage(data.error);
			}
			else {
				if (data.success) {
					setSuccess(true);
				}
				else {
					setErrorMessage('An error happened while sending the contact form. This is probably not your fault. Please try again, or send an email directly to info@podfriend.com');
					console.log('No success returned when logging in');
				}
			}
		})
		.catch((error) => {
			setErrorMessage('An error happened while sending the contact form. This is probably not your fault. Please try again, or send an email directly to info@podfriend.com');
			console.log(error);
		});
	};

	return (
		<>
			{ success === false &&
				<>
					<Typography variant="h6" gutterBottom>
						Please fill out a few details
					</Typography>
					<Grid container spacing={3}>
						<Grid item xs={12} sm={6}>
							<TextField
								required
								id="firstName"
								name="firstName"
								label="Your name"
								value={valueName}
								onChange={(event) => { setValueName(event.target.value); }}
								fullWidth
								autoComplete="given-name"
								variant={'outlined'}
							/>
						</Grid>
						<Grid item xs={12} sm={6}>
							<TextField
								required
								id="email"
								name="email"
								label="Your email"
								value={valueEmail}
								onChange={(event) => { setValueEmail(event.target.value); }}
								fullWidth
								variant={'outlined'}
							/>
						</Grid>
						<Grid item xs={12} sm={12}>
							<FormControl fullWidth variant='outlined'>
								<InputLabel>What is this about?</InputLabel>
								<Select
									value={contactReason}
									inputProps={{
										name: 'contactReason',
										id: 'contact-reason',
									}}

									labelWidth={150}
									onChange={(event) => { setContactReason(event.target.value); }}
									fullWidth
								>
									{contactReasons.map((reason) => (
										<MenuItem key={reason} value={reason}>
											{reason}
										</MenuItem>
									))}
								</Select>
								{ contactReason === 'My podcast is on Podfriend and I want it to be taken down' &&
									<Alert severity="warning" style={{ marginTop: 10 }}>
										You can remove your podcast from public listings by deleting your public RSS feed.<br />
										<br />
										Podfriend uses the open podcastindex.org for podcast listings, if you want your podcast removed, please contact: info@podcastindex.org<br /><br />
										If you still think Podfriend can help with anything, you are of course welcome to fill out the contact form.
									</Alert>
								}
							</FormControl>
						</Grid>
						<Grid item xs={12}>
							<TextField
								required
								id="message"
								name="message"
								label="Your message"
								value={valueMessage}
								onChange={(event) => { setValueMessage(event.target.value); }}
								rows={6}
								variant={'outlined'}
								multiline
								fullWidth
							/>
						</Grid>
						<Grid item xs={12}>
							{ errorMessage && 
								<Alert severity="error" style={{ marginBottom: 10 }}>
									{errorMessage}
								</Alert>
							}
							<button style={{ width: '100%' }} onClick={sendForm}>
								Send message to Podfriend
							</button>
						</Grid>
					</Grid>
				</>
			}
			{ success === true &&
				<Alert severity="success">Woohoooo! Your message has been sent. Thanks for reaching out. You will get a reply as fast as humanly possible!</Alert>
			}
		</>
	);
};

const ContactPage = () => {
	const [success,setSuccess] = useState(false);

	return (
		<PodcastPage title="For Podcasters" pageType="landingPage">
			<Grid container>
				<Grid item xs={12}>
					<div className="hero">
						<Grid container alignItems="center" justify="center">
							<Grid item xs={12} lg="6" alignItems="center" justify="center">
								{ success === true &&
									<h1>Thanks for reaching out!</h1>
								}
								{ success !== true &&
									<>
										<h2>Got feedback?</h2>
										<h1>Get in touch!</h1>
										<p>If you have suggestions, requests or just want to say &quot;Hey I love you Podfriend!&quot;, then congratulations. You found the right place!</p>
										<p>
											Please do remember, that Podfriend currently is a one man operation, and while I always strive to answer as fast as possible, then it's a reality that sometimes it's simply not possible because of other priorities.
										</p>
										<p>
											If I haven't replied after a few days, then I probably really wanted to, but forgot to while juggling other tasks - Feel free to nudge me in that case, I won't take it personally!
										</p>
										<p>
											Also, I love feedback and feature requests, so don't hesitate sending it!
										</p>
									</>
								}
							</Grid>
						</Grid>
					</div>
				</Grid>
			</Grid>
				<div className="pageContent">
					<Grid container alignItems="center" justify="center">
						<Grid item alignItems="center" justify="center">
						
							<Paper style={{
								padding: 20,
								maxWidth: 600,
								marginLeft: 'auto',
								marginRight: 'auto'
							}}>
								<ContactForm
									success={success}
									setSuccess={setSuccess}
								/>
							</Paper>

							<div style={{ marginTop: 20, padding: 20 }}>
								<Typography variant="h6" gutterBottom>
									You can also find us on social media
								</Typography>
								<div style={{ marginTop: 20 }}>
									<div style={{ display: 'flex', alignItems: 'center' }}>
										<FaFacebookSquare style={{ fill: '#0176e5', marginRight: 10 }} size={36} /> <a href='https://www.facebook.com/GoPodfriend' target="_blank">Facebook</a>
									</div>
									<div style={{ display: 'flex', alignItems: 'center', marginTop: 10 }}>
										<FaTwitterSquare style={{ fill: '#0176e5', marginRight: 10 }} size={36} /> <a href='https://www.twitter.com/GoPodfriend' target="_blank">Twitter</a>
									</div>
									<div style={{ display: 'flex', alignItems: 'center', marginTop: 10 }}>
										<FaMastodon style={{ fill: '#0176e5', marginRight: 10 }} size={36} /> <a href='https://podcastindex.social/@martin' target="_blank">Mastodon (podcastindex.social)</a>
									</div>
								</div>
							</div>
						</Grid>
					</Grid>
				</div>
			
		</PodcastPage>
	);
};

export default ContactPage;