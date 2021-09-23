import React from 'react';

import { IonButtons, IonContent, IonSearchbar, IonHeader, IonMenuButton, IonPage, IonTitle, IonToolbar } from '@ionic/react';

const PageHeader = ({title}) => {
	return (
		<IonHeader collapse="condense">
			<IonToolbar>
				<IonTitle size="large">{title}</IonTitle>
			</IonToolbar>
			<IonToolbar>
				<IonSearchbar></IonSearchbar>
			</IonToolbar>
		</IonHeader>
	);
};

export default PageHeader;

/*
import styles from './PageHeader.scss';

const PageHeader = ({title}) => {
	return (
		<div className={styles.titleContainer}>
			<h1>{title}</h1>
		</div>
	);
};

export default PageHeader;
*/