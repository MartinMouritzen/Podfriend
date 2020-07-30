import React, { Component } from 'react';

import styles from './SectionHeader.css';

/**
*
*/
class SectionHeader extends Component {
	/**
	*
	*/
	constructor(props) {
		super(props);
	}
	render() {
		return (
			<div className={styles.sectionHeader}>
				{this.props.children}
			</div>
		);
	}
}
export default SectionHeader;