import React, { Component } from 'react';

// const { getCurrentWindow } = require('electron').remote;

import SectionHeader from '~/app/components/Page/SectionHeader';

import Page from 'podfriend-approot/components/UI/Layout/Page.jsx';
import TitleHeader from 'podfriend-approot/components/UI/Layout/TitleHeader.jsx';

import styles from './SettingsPage.css';

import localforage from 'localforage';

const SettingsPage = () => {
	const deleteLocalData = () => {
		if (confirm('Are you sure you want to delete all your local data? This cannot be undone. Your information is still saved on the server.','Delete private data')) {
			localforage.clear().then(() => {
				alert('Local data has been deleted.');
				window.location.reload(false); 
			});
		}
	}

	const deletePrivateData = () => {
		if (confirm('Are you sure you want to delete ALL your data? This cannot be undone.','Delete private data')) {
			localforage.clear().then(() => {
				alert('Local data has been deleted. Server data deletion is not yet supported. Please email info@podfriend.com to be deleted fully.');
				window.location.reload(false); 
			});
		}
	}
	return (
		<Page>
			<TitleHeader>Settings</TitleHeader>
			
			<SectionHeader>Language</SectionHeader>
			<div style={{ padding: '20px' }}>
				... Coming ...
			</div>

			<SectionHeader>Your data</SectionHeader>
			<div style={{ marginTop: '20px' }}>
				<button onClick={deleteLocalData}>Delete my local data (Might be good if you encounter bugs)</button>
			</div>
			<div style={{ marginTop: '20px' }}>
				<button onClick={deletePrivateData}>Delete my private data (Will delete both local and serverside data. Good if you hate Podfriend)</button>
			</div>
		</Page>
	);
}
export default SettingsPage;