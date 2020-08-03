import React, { Component } from 'react';

import styles from './ContextMenu.css';

/**
*
*/
export class ContextMenu extends Component {
	/**
	*
	*/
	constructor(props) {
		super(props);
		
		this.state = {
			show: this.props.show ? this.props.show : this.props.target ? false : true,
			showType: this.props.show ? 'auto' : this.props.target ? 'auto' : 'managed',
		};
		this.onContextMenu = this.onContextMenu.bind(this);
		this.onWindowBlur = this.onWindowBlur.bind(this);
		this.onWindowClick = this.onWindowClick.bind(this);
	}
	/**
	*
	*/
	componentDidMount() {
		window.addEventListener('click',this.onWindowClick, false);
		// window.addEventListener('contextmenu',this.onContextMenu, false);
		window.addEventListener('blur',this.onWindowBlur, false);
	}
	/**
	*
	*/
	componentWillUnmount() {
		window.removeEventListener('click',this.onWindowClick, false);
		// window.removeEventListener('contextmenu',this.onContextMenu, false);
		window.removeEventListener('blur',this.onWindowBlur, false);
	}
	/**
	*
	*/
	onWindowBlur(event) {
		if (this.state.showType == 'auto') {
			this.setState({
				show: false
			});
		}
		
		if (this.props.onMenuHide) {
			this.props.onMenuHide();
		}
	}
	/**
	*
	*/
	onContextMenu(event) {
		if (!this.props.target) {
			return;
		}
		// var targetElement = document.querySelector(this.props.target);
		
		// console.log('contextmenu!');
		// console.log(targetElement);
		
		if (!this.state.show && event.target.matches(this.props.target + ', ' + this.props.target + ' *')) {
			this.setState({
				show: true
			});
		}
		else if (this.state.show && this.state.showType == 'auto') {
			this.setState({
				show: false
			});
		}

		if (this.props.onMenuHide) {
			this.props.onMenuHide();
		}
	}
	/**
	*
	*/
	onWindowClick(event) {
		if (this.state.show && this.state.showType == 'auto') {
			this.setState({
				show: false
			});
		}

		if (this.props.onMenuHide) {
			this.props.onMenuHide();
		}
	}
	/**
	*
	*/
	render() {
		return (
			<div className={styles.contextMenu} style={{...this.props.style,display: this.state.show ? 'block' : 'none'}}>
				{this.props.children}
			</div>
		);
	}
}
/**
*
*/
export class ContextMenuItem extends Component {
	/**
	*
	*/
	constructor(props) {
		super(props);
	}
	/**
	*
	*/
	render() {
		const Icon = this.props.icon;
		
		var innerMenuItem = (
			<div className={styles.contextMenuItem} style={this.props.style}>
				{this.props.children}
			</div>
		);
		

		
		return innerMenuItem;
	}
}