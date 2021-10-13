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
		<IonPage className='home'>
			<IonHeader>
				<IonToolbar className='titleToolbar'>
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
				</IonHeader>
				<div>
					Hello test 1
				</div>
			</IonContent>
		</IonPage>
	);
}

export default Welcome;