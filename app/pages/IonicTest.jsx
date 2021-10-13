import React, { useEffect, useState } from 'react';

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

import Welcome from 'podfriend-approot/pages/Welcome.jsx';

/**
*
*/
const IonicTest = () => {
	return (
		<IonPage className='home'>
			<IonHeader>
				<IonToolbar className='titleToolbar'>
					<IonTitle>
						<div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
							<IonIcon src={require('podfriend-approot/images/logo/podfriend_logo.svg')} style={{ fill: '#000000', fontSize: 36, marginRight: 10 }} />
							<span style={{ fontSize: 26 }}>Podfriend</span>
						</div>
					</IonTitle>
				</IonToolbar>
			</IonHeader>
			<IonContent className="ion-padding" fullscreen>
				<IonHeader>
					<IonToolbar className='searchToolbar'>
						<IonSearchbar placeholder='Search for a podcast' />
					</IonToolbar>
					{ /*
					<IonToolbar>
						<IonSegment mode='md' value="home">
							<IonSegmentButton value="episodes">
								<IonLabel>Episodes</IonLabel>
							</IonSegmentButton>
							<IonSegmentButton value="home">
								<IonLabel>Home</IonLabel>
							</IonSegmentButton>
							<IonSegmentButton value="groups">
								<IonLabel>Groups</IonLabel>
							</IonSegmentButton>
						</IonSegment>
					</IonToolbar>
					*/ }
				</IonHeader>
				<Welcome />
				{/*
				<div className={feedPageStyles.page}>
					<div className={feedPageStyles.postColumn}>
						<PostForm
							
						/>
					</div>
					<div style={{  width: '100%', maxWidth: '644px', display: 'flex', flexDirection: 'column' }}>

					</div>
					<div className={feedPageStyles.rightColumn}>

					</div>
				</div>
				*/ }
			</IonContent>
		</IonPage>
	);
}

export default IonicTest;