import React from 'react';

import { FaExternalLinkAlt } from "react-icons/fa";

import isElectron from 'is-electron';

import styles from './PodcastPersons.scss';

const PodcastPersons = ({ persons }) => {

	const goToWebsite = (website) => {
		if (!website) {
			return false;
		}
		if (isElectron()) {
			var shell = require('electron').shell;
			shell.openExternal(website);
		}
		else {
			window.open(website,"_blank");
		}
	}

	return (
		<div className={styles.persons}>
			{ persons.map && persons.map((person) => {
				return (
					<div key={person.name} className={styles.person} onClick={() => { goToWebsite(person.href); }}>
						{ person.img && 
							<img src={person.img} className={styles.photo} />
						}
						<div className={styles.name}>
							{person.name ? person.name : person['#text'] }
						</div>
						{ person.role &&
							<div className={styles.role}>
								{person.role}
							</div>
						}
					</div>
				)
			}) }
		</div>
	);
}
export default PodcastPersons;