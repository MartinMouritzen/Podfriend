import React, { useEffect, useRef, useState } from 'react';

import SVG from 'react-inlinesvg';

import {
	IonPage,
	IonHeader,
	IonToolbar,
	IonTitle,
	IonButtons,
	IonButton,
	IonIcon,
	IonContent,
	IonBackButton,
	IonMenuButton,
	IonSearchbar,
	IonSegment,
	IonSegmentButton,
	IonLabel,
	IonReactRouter,
	IonRouterOutlet
} from '@ionic/react';

import { useDispatch, useSelector } from 'react-redux';

import { initiateLogin } from "~/app/redux/actions/uiActions";

import Events from 'podfriend-approot/library/Events.js';

import Welcome from 'podfriend-approot/pages/Welcome.jsx';

import UserTitleBar from 'podfriend-approot/components/user/userTitleBar.jsx';

import MainMenu from 'podfriend-approot/components/Navigation/MainMenu.jsx';

/**
*
*/
const IonicTest = () => {
	const dispatch = useDispatch();

	const page = useRef(null);

	const searchElement = useRef(null);
	const [searchText, setSearchText] = useState('');
	const [menuVisible, setMenuVisible] = useState(false);

	const isLoggedIn = useSelector((state) => state.user.isLoggedIn);
	const profileData = useSelector((state) => state.user.profileData);

	const onSearch = (event) => {
		Events.emit('OnSearch',searchElement.current.value);
		event.preventDefault();
		return false;
	};

	const onSearchTextChange = (event) => {
		console.log(event.detail.value);
		setSearchText(event.detail.value);
	};

	const showMenu = () => {
		console.log('showmenu');
		setMenuVisible(true);
	};
	const hideMenu = () => {
		console.log('hideMenu');
		setMenuVisible(false);
	};

	return (
		<IonPage className='home' id="main" ref={page}>
			{ menuVisible &&
				<MainMenu showMenu={menuVisible} onDismiss={hideMenu} presentingElement={page ? page.current : null} />
			}
			<IonHeader>
				<IonToolbar className='titleToolbar'>
					<IonButtons slot="end">
						{ !isLoggedIn &&
							<IonButton onClick={() => { dispatch(initiateLogin()); }}>
								<IonIcon src={require('podfriend-approot/images/design/titlebar/userProfile.svg')} />
							</IonButton>
						}
						{ isLoggedIn &&
							<IonButton onClick={showMenu}>
								<span style={{ maxWidth: 60, whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
									{profileData.username}
								</span>
							</IonButton>
						}
					</IonButtons>
					<IonTitle>
						<div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', paddingTop: '6px' }}>
							<IonIcon src={require('podfriend-approot/images/logo/podfriend_logo.svg')} style={{ fill: '#000000', fontSize: 32, marginRight: 10 }} />
							<span style={{ fontSize: 26 }}>Podfriend</span>
						</div>
					</IonTitle>
				</IonToolbar>
			</IonHeader>
			<IonContent className="ion-padding">
				<IonHeader>
					<IonToolbar className='searchToolbar'>
						<form onSubmit={onSearch}>
							<IonSearchbar placeholder='Search for a podcast' value={searchText} onIonChange={onSearchTextChange} inputMode='search' ref={searchElement} />
						</form>
					</IonToolbar>
				</IonHeader>
				<Welcome />
			</IonContent>
		</IonPage>
	);
}

export default IonicTest;