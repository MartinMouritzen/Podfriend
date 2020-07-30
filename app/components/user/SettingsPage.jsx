import React, { Component } from 'react';

const { getCurrentWindow } = require('electron').remote;

import SectionHeader from '~/app/components/Page/SectionHeader';

import styles from './SettingsPage.css';

/**
*
*/
class SettingsPage extends Component {
	/**
	*
	*/
	constructor(props) {
		super(props);
		
		this.deletePrivateData = this.deletePrivateData.bind(this);
	}
	/**
	*
	*/
	deleteLocalData() {
		if (confirm('Are you sure you want to delete all your local data? This cannot be undone.','Delete private data')) {
			localStorage.clear();
			getCurrentWindow().reload();
		}
	}
	/**
	*
	*/
	deletePrivateData() {
		if (confirm('Are you sure you want to delete all your data? This cannot be undone.','Delete private data')) {
			localStorage.clear();
			getCurrentWindow().reload();
		}
	}
	/**
	*
	*/
	render() {
		return (
			<div className={styles.page}>
				<div className={styles.title}>Settings</div>
				
				<SectionHeader>Language</SectionHeader>
				<div>
					... Coming ...
				</div>

				<SectionHeader>Your data</SectionHeader>
				<div>
					<button onClick={this.deleteLocalData}>Delete my local data (Might be good if you encounter bugs)</button>
				</div>
				<div>
					<button onClick={this.deletePrivateData}>Delete my private data (Will delete both local and serverside data. Good if you hate Podfriend)</button>
				</div>
			</div>
		);
	}
}
export default SettingsPage;