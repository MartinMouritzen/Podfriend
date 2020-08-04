import React, { Component } from 'react';

import { FaHeart } from "react-icons/fa";

import LatestVisitedPodcasts from 'podfriend-approot/components/Lists/LatestVisitedPodcasts.jsx';

import logo from './../images/logo/podfriend_logo_128x128.png';

import styles from './welcome.css';




/**
*
*/
class Welcome extends Component {
	/**
	*
	*/
	constructor(props) {
		super(props);
	}
	render() {
		return (
			<div className={styles.homePage}>
				<div className={styles.title}>Welcome</div>
				<div className={styles.welcomeMessage}>
					<img src={logo} className={styles.logo} />
					<p className={styles.paragraphHeadline}>Welcome to Podfriend, I am so happy that you're here!</p>
					<p>This program is more or less a labor of love. I love podcasts, and I've never really been able to find a podcast app where there wasn't something that I thought could be improved, so I thought I'd give it a try myself. Of course nothing is perfect, but let's see how close we can get.</p>
					<p>This is a very early release, which means you're bound to find weird, unfinished and perhaps even comical things here. Some things might make no sense at all until they're further along in development. I'll try to limit those to selected hardcore testers, but you never know, so please be patient.</p>
					<p>You might also find really annoying bugs. Sorry for that in advance. I do a lot of testing, but I'm just one person. what I can do is promise you that I will fix the bugs as soon as I can.</p>
					
					<p>I hope together, we can have great fun, because everyone needs a Podfriend! <FaHeart /></p>
					<p>Martin.</p>
				</div>
				<div className={styles.subHeadline}>Your recent podcasts</div>
				<div className={styles.podcastLine}>
					<LatestVisitedPodcasts />
				</div>
				<div className={styles.subHeadline}>Podcasts recommended by your friends</div>
				<div>Coming soon</div>
			</div>
		);
	}
}

export default Welcome;