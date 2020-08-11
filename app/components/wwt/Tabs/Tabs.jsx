import React from 'react';

import { Switch, Route, Link, withRouter } from 'react-router-alias';

import { TouchableHighlight } from 'react-native';
import { View, Text } from 'podfriend-approot/components/Layout/';

import styles from './style.Tabs.js';
/*
					<Link to={'/podcast/' + this.props.selectedPodcast.path}>Episodes</Link>
					<Link to={'/podcast/' + this.props.selectedPodcast.path + '/reviews'}>Reviews</Link>
					<Switch>
						<Route exact path={'/podcast/' + this.props.selectedPodcast.path}>
							Test!
						</Route>
						<Route path={'/podcast/' + this.props.selectedPodcast.path + '/reviews'}>
							test2
						</Route>
					</Switch>
*/
class TabsInternal extends React.Component {
	/**
	*
	*/
	constructor(props) {
		super(props);
		
		var selectedIndex = this.getSelectedIndex();
		
		this.tabRefs = [];
		
		this.state = {
			selectedIndex: selectedIndex,
			tabOffsetLeft: 0,
			tabWidth: 100
		};
		this.changeActiveTab = this.changeActiveTab.bind(this);
	}
	componentDidMount() {
		this.changeActiveTab();
	}
	getSelectedIndex() {
		var selectedIndex = 0;
		for(var i=0;i<this.props.children.length;i++) {
			if (this.props.children[i].props.link === this.props.location.pathname) {
				selectedIndex = i;
				break;
			}
		}
		return selectedIndex;
	}
	/**
	*
	*/
	componentDidUpdate(prevProps, prevState, snapshot) {
		if (prevProps.location.pathname !== this.props.location.pathname) {
			var selectedIndex = this.getSelectedIndex();
			
			this.setState({
				selectedIndex: selectedIndex
			},() => {
				this.changeActiveTab();
			});
		}
	}
	changeActiveTab() {
		var activeTabRef = this.tabRefs[this.state.selectedIndex];
		this.setState({
			tabOffsetLeft: activeTabRef.offsetLeft,
			tabWidth: activeTabRef.offsetWidth
		});
	}
	render() {
		return (
			<View>
				<View style={styles.Tabs}>
					{ this.props.children.map((TabChild,index) => {
						return (
							<Link to={TabChild.props.link} key={'TabHeading' + TabChild.props.title} ref={(ref) => { this.tabRefs[index] = ref}} style={styles.TabLink}>
								<View style={(index == this.state.selectedIndex ? styles.selectedTab : styles.Tab)}>
									<Text style={styles.TabText}>{TabChild.props.title}</Text>
									{TabChild.props.badge &&
										<View style={styles.badge}>
											<Text style={styles.badgeText}>{TabChild.props.badge}</Text>
										</View>
									}
								</View>
							</Link>
						);
/*
						return (
							<Link to={TabChild.props.link} key={'TabHeading' + TabChild.props.title}>
							<TouchableHighlight underlayColor="#eeeeee" onPress={() => { this.changeActiveTab(index); }} style={styles.TabOuter} ref={(ref) => { this.tabRefs[index] = ref}}>
								<View style={(index == this.state.selectedIndex ? styles.selectedTab : styles.Tab)}>
									<Text>{TabChild.props.title}</Text>
									{TabChild.props.badge &&
										<View style={styles.badge}>
											<Text style={styles.badgeText}>{TabChild.props.badge}</Text>
										</View>
									}
								</View>
							</TouchableHighlight>
							</Link>
						);
*/
					}) }
				</View>
				<View style={styles.tabBorder}>
					<View style={{ transition: 'all 0.2s', backgroundColor: '#0176e5', width: this.state.tabWidth, height: '3px', position: 'relative', left: this.state.tabOffsetLeft }}>
						
					</View>
				</View>
				<View style={styles.tabContent}>
					{this.renderTabContent()}
				</View>
			</View>
		);
	}
	/**
	*
	*/
	renderTabContent() {
		return (
			<Switch>
				{ this.props.children.map((child,index) => {
					return (
						<Route exact key={'TabChild' + index} path={child.props.link}>
							{ child }
						</Route>
					);
				}) }
			</Switch>
		);

		/*
		let result = null;
		for(var i=0;i<this.props.children.length;i++) {
			if (i === this.state.selectedIndex) {
				result = (
					<>
						{ this.props.children[i] }
					</>
				);
			}
		}
		return result;
		*/
	}
}
class TabInternal extends React.Component {
	render() {
		return (
			<div>
				{this.props.children}
			</div>
		);
	}
}

export const Tabs = withRouter(TabsInternal);
export const Tab = TabInternal;
