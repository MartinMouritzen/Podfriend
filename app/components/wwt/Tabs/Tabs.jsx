import React from 'react';

import { Switch, Route, Link, withRouter } from 'react-router-alias';

import { View, Text } from 'react-native-web';

import styles from './style.Tabs.js';

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
		this.refreshActiveBorder = this.refreshActiveBorder.bind(this);
	}
	componentDidMount() {
		this.changeActiveTab();
		window.addEventListener('resize',this.refreshActiveBorder)
	}
	componentWillUnmount() {
		window.removeEventListener('resize',this.refreshActiveBorder)
	}
	getSelectedIndex() {
		var selectedIndex = 0;
		for(var i=0;i<this.props.children.length;i++) {
			if (this.props.children[i].props && this.props.children[i].props.link === this.props.location.pathname) {
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
		if (prevProps.location.pathname !== this.props.location.pathname || prevProps.children !== this.props.children) {
			var selectedIndex = this.getSelectedIndex();
			
			this.setState({
				selectedIndex: selectedIndex
			},() => {
				this.changeActiveTab();
			});
		}
	}
	changeActiveTab() {
		this.refreshActiveBorder();
	}
	refreshActiveBorder() {
		var activeTabRef = this.tabRefs[this.state.selectedIndex];
		this.setState({
			tabOffsetLeft: activeTabRef.offsetLeft,
			tabWidth: activeTabRef.offsetWidth
		});
	}
	render() {
		return (
			<View>
				<View style={styles.TabsOuter}>
					<View style={styles.Tabs}>
						{ this.props.children.map((TabChild,index) => {
							if (!TabChild || !TabChild.props || !TabChild.props.link) {
								return null;
							}
							return (
								<Link to={{
									pathname: TabChild.props.link,
									state: {
										preventScroll: true
									}
								}} key={'TabHeading' + TabChild.props.title} ref={(ref) => { this.tabRefs[index] = ref}} style={styles.TabLink}>
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
						}) }
					</View>
					<View style={styles.tabBorder}>
						<View style={{ transition: 'all 0.2s', backgroundColor: '#0176e5', width: this.state.tabWidth, height: '3px', position: 'relative', left: this.state.tabOffsetLeft }}>
							
						</View>
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
					if (!child || !child.props || !child.props.link) {
						return null;
					}
					return (
						<Route exact key={'TabChild' + index} path={child.props.link}>
							{ child }
						</Route>
					);
				}) }
			</Switch>
		);
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
