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

const PodcastHistory = ({}) => {
	return (
		<IonPage>
			<IonHeader>
				<IonToolbar>
					<IonTitle>
						History
					</IonTitle>
				</IonToolbar>
			</IonHeader>
			<IonContent className="ion-padding" fullscreen>
				<IonHeader collapse='condense'>
					<IonToolbar>
					<IonTitle size='large'>Default Title</IonTitle>
					</IonToolbar>
				</IonHeader>
			</IonContent>
		</IonPage>
	);
};

export default PodcastHistory;