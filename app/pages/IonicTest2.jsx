import React, { useEffect, useState } from 'react';

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
	IonRouterOutlet,
	Route
} from '@ionic/react';

/**
*
*/
const Welcome = () => {
	return (
		<IonPage>
			<IonHeader>
				<IonToolbar className='titleToolbar'>
					<IonButtons slot="start">
						<IonBackButton defaultHref="/" />
					</IonButtons>
					<IonTitle>
						Test 1
					</IonTitle>
				</IonToolbar>
			</IonHeader>
			<IonContent className="ion-padding" fullscreen>
				<IonHeader>
					<IonToolbar className='searchToolbar'>
						<IonSearchbar placeholder='Search for a podcast' />
					</IonToolbar>
				</IonHeader>
				<div>
					Hello test 1
				</div>
			</IonContent>
		</IonPage>
	);
}

export default Welcome;