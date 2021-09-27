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
	IonMenuButton,
	IonSearchbar
  } from '@ionic/react';


  import { notificationsOutline } from 'ionicons/icons';
/**
*
*/
const Welcome = () => {
	return (
<IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Activity</IonTitle>
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonButtons slot="end">
            <IonButton onClick={() => setShowNotifications(true)}>
              <IonIcon icon={notificationsOutline} />
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding" fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Activity</IonTitle>
          </IonToolbar>
		  <IonToolbar>
				<div>
					HELO!
					</div>
			</IonToolbar>
        </IonHeader>
		<div>test 123 yeahtest 123 yeahtest 123 yeahtest 123 yeahtest 123 yeahtest 123 yeahtest 123 yeahtest 123 yeahtest 123 yeahtest 123 yeahtest 123 yeahtest 123 yeahtest 123 yeahtest 123 yeahtest 123 yeahtest 123 yeahtest 123 yeah</div>
		<div>test 123 yeahtest 123 yeahtest 123 yeahtest 123 yeahtest 123 yeahtest 123 yeahtest 123 yeahtest 123 yeahtest 123 yeahtest 123 yeahtest 123 yeahtest 123 yeahtest 123 yeahtest 123 yeahtest 123 yeahtest 123 yeahtest 123 yeah</div>
		<div>test 123 yeahtest 123 yeahtest 123 yeahtest 123 yeahtest 123 yeahtest 123 yeahtest 123 yeahtest 123 yeahtest 123 yeahtest 123 yeahtest 123 yeahtest 123 yeahtest 123 yeahtest 123 yeahtest 123 yeahtest 123 yeahtest 123 yeah</div>
		<div>test 123 yeahtest 123 yeahtest 123 yeahtest 123 yeahtest 123 yeahtest 123 yeahtest 123 yeahtest 123 yeahtest 123 yeahtest 123 yeahtest 123 yeahtest 123 yeahtest 123 yeahtest 123 yeahtest 123 yeahtest 123 yeahtest 123 yeah</div>
		<div>test 123 yeahtest 123 yeahtest 123 yeahtest 123 yeahtest 123 yeahtest 123 yeahtest 123 yeahtest 123 yeahtest 123 yeahtest 123 yeahtest 123 yeahtest 123 yeahtest 123 yeahtest 123 yeahtest 123 yeahtest 123 yeahtest 123 yeah</div>
		<div>test 123 yeahtest 123 yeahtest 123 yeahtest 123 yeahtest 123 yeahtest 123 yeahtest 123 yeahtest 123 yeahtest 123 yeahtest 123 yeahtest 123 yeahtest 123 yeahtest 123 yeahtest 123 yeahtest 123 yeahtest 123 yeahtest 123 yeah</div>
		<div>test 123 yeahtest 123 yeahtest 123 yeahtest 123 yeahtest 123 yeahtest 123 yeahtest 123 yeahtest 123 yeahtest 123 yeahtest 123 yeahtest 123 yeahtest 123 yeahtest 123 yeahtest 123 yeahtest 123 yeahtest 123 yeahtest 123 yeah</div>
		<div>test 123 yeahtest 123 yeahtest 123 yeahtest 123 yeahtest 123 yeahtest 123 yeahtest 123 yeahtest 123 yeahtest 123 yeahtest 123 yeahtest 123 yeahtest 123 yeahtest 123 yeahtest 123 yeahtest 123 yeahtest 123 yeahtest 123 yeah</div>
		<div>test 123 yeahtest 123 yeahtest 123 yeahtest 123 yeahtest 123 yeahtest 123 yeahtest 123 yeahtest 123 yeahtest 123 yeahtest 123 yeahtest 123 yeahtest 123 yeahtest 123 yeahtest 123 yeahtest 123 yeahtest 123 yeahtest 123 yeah</div>
		<div>test 123 yeahtest 123 yeahtest 123 yeahtest 123 yeahtest 123 yeahtest 123 yeahtest 123 yeahtest 123 yeahtest 123 yeahtest 123 yeahtest 123 yeahtest 123 yeahtest 123 yeahtest 123 yeahtest 123 yeahtest 123 yeahtest 123 yeah</div>

		<div>test 123 yeahtest 123 yeahtest 123 yeahtest 123 yeahtest 123 yeahtest 123 yeahtest 123 yeahtest 123 yeahtest 123 yeahtest 123 yeahtest 123 yeahtest 123 yeahtest 123 yeahtest 123 yeahtest 123 yeahtest 123 yeahtest 123 yeah</div>
		<div>test 123 yeahtest 123 yeahtest 123 yeahtest 123 yeahtest 123 yeahtest 123 yeahtest 123 yeahtest 123 yeahtest 123 yeahtest 123 yeahtest 123 yeahtest 123 yeahtest 123 yeahtest 123 yeahtest 123 yeahtest 123 yeahtest 123 yeah</div>
		<div>test 123 yeahtest 123 yeahtest 123 yeahtest 123 yeahtest 123 yeahtest 123 yeahtest 123 yeahtest 123 yeahtest 123 yeahtest 123 yeahtest 123 yeahtest 123 yeahtest 123 yeahtest 123 yeahtest 123 yeahtest 123 yeahtest 123 yeah</div>
		<div>test 123 yeahtest 123 yeahtest 123 yeahtest 123 yeahtest 123 yeahtest 123 yeahtest 123 yeahtest 123 yeahtest 123 yeahtest 123 yeahtest 123 yeahtest 123 yeahtest 123 yeahtest 123 yeahtest 123 yeahtest 123 yeahtest 123 yeah</div>
		<div>test 123 yeahtest 123 yeahtest 123 yeahtest 123 yeahtest 123 yeahtest 123 yeahtest 123 yeahtest 123 yeahtest 123 yeahtest 123 yeahtest 123 yeahtest 123 yeahtest 123 yeahtest 123 yeahtest 123 yeahtest 123 yeahtest 123 yeah</div>
		<div>test 123 yeahtest 123 yeahtest 123 yeahtest 123 yeahtest 123 yeahtest 123 yeahtest 123 yeahtest 123 yeahtest 123 yeahtest 123 yeahtest 123 yeahtest 123 yeahtest 123 yeahtest 123 yeahtest 123 yeahtest 123 yeahtest 123 yeah</div>
		<div>test 123 yeahtest 123 yeahtest 123 yeahtest 123 yeahtest 123 yeahtest 123 yeahtest 123 yeahtest 123 yeahtest 123 yeahtest 123 yeahtest 123 yeahtest 123 yeahtest 123 yeahtest 123 yeahtest 123 yeahtest 123 yeahtest 123 yeah</div>
		<div>test 123 yeahtest 123 yeahtest 123 yeahtest 123 yeahtest 123 yeahtest 123 yeahtest 123 yeahtest 123 yeahtest 123 yeahtest 123 yeahtest 123 yeahtest 123 yeahtest 123 yeahtest 123 yeahtest 123 yeahtest 123 yeahtest 123 yeah</div>
		<div>test 123 yeahtest 123 yeahtest 123 yeahtest 123 yeahtest 123 yeahtest 123 yeahtest 123 yeahtest 123 yeahtest 123 yeahtest 123 yeahtest 123 yeahtest 123 yeahtest 123 yeahtest 123 yeahtest 123 yeahtest 123 yeahtest 123 yeah</div>
		<div>test 123 yeahtest 123 yeahtest 123 yeahtest 123 yeahtest 123 yeahtest 123 yeahtest 123 yeahtest 123 yeahtest 123 yeahtest 123 yeahtest 123 yeahtest 123 yeahtest 123 yeahtest 123 yeahtest 123 yeahtest 123 yeahtest 123 yeah</div>

		<div>test 123 yeahtest 123 yeahtest 123 yeahtest 123 yeahtest 123 yeahtest 123 yeahtest 123 yeahtest 123 yeahtest 123 yeahtest 123 yeahtest 123 yeahtest 123 yeahtest 123 yeahtest 123 yeahtest 123 yeahtest 123 yeahtest 123 yeah</div>
		<div>test 123 yeahtest 123 yeahtest 123 yeahtest 123 yeahtest 123 yeahtest 123 yeahtest 123 yeahtest 123 yeahtest 123 yeahtest 123 yeahtest 123 yeahtest 123 yeahtest 123 yeahtest 123 yeahtest 123 yeahtest 123 yeahtest 123 yeah</div>
		<div>test 123 yeahtest 123 yeahtest 123 yeahtest 123 yeahtest 123 yeahtest 123 yeahtest 123 yeahtest 123 yeahtest 123 yeahtest 123 yeahtest 123 yeahtest 123 yeahtest 123 yeahtest 123 yeahtest 123 yeahtest 123 yeahtest 123 yeah</div>
		<div>test 123 yeahtest 123 yeahtest 123 yeahtest 123 yeahtest 123 yeahtest 123 yeahtest 123 yeahtest 123 yeahtest 123 yeahtest 123 yeahtest 123 yeahtest 123 yeahtest 123 yeahtest 123 yeahtest 123 yeahtest 123 yeahtest 123 yeah</div>
		<div>test 123 yeahtest 123 yeahtest 123 yeahtest 123 yeahtest 123 yeahtest 123 yeahtest 123 yeahtest 123 yeahtest 123 yeahtest 123 yeahtest 123 yeahtest 123 yeahtest 123 yeahtest 123 yeahtest 123 yeahtest 123 yeahtest 123 yeah</div>
		<div>test 123 yeahtest 123 yeahtest 123 yeahtest 123 yeahtest 123 yeahtest 123 yeahtest 123 yeahtest 123 yeahtest 123 yeahtest 123 yeahtest 123 yeahtest 123 yeahtest 123 yeahtest 123 yeahtest 123 yeahtest 123 yeahtest 123 yeah</div>
		<div>test 123 yeahtest 123 yeahtest 123 yeahtest 123 yeahtest 123 yeahtest 123 yeahtest 123 yeahtest 123 yeahtest 123 yeahtest 123 yeahtest 123 yeahtest 123 yeahtest 123 yeahtest 123 yeahtest 123 yeahtest 123 yeahtest 123 yeah</div>
		<div>test 123 yeahtest 123 yeahtest 123 yeahtest 123 yeahtest 123 yeahtest 123 yeahtest 123 yeahtest 123 yeahtest 123 yeahtest 123 yeahtest 123 yeahtest 123 yeahtest 123 yeahtest 123 yeahtest 123 yeahtest 123 yeahtest 123 yeah</div>
		<div>test 123 yeahtest 123 yeahtest 123 yeahtest 123 yeahtest 123 yeahtest 123 yeahtest 123 yeahtest 123 yeahtest 123 yeahtest 123 yeahtest 123 yeahtest 123 yeahtest 123 yeahtest 123 yeahtest 123 yeahtest 123 yeahtest 123 yeah</div>
		<div>test 123 yeahtest 123 yeahtest 123 yeahtest 123 yeahtest 123 yeahtest 123 yeahtest 123 yeahtest 123 yeahtest 123 yeahtest 123 yeahtest 123 yeahtest 123 yeahtest 123 yeahtest 123 yeahtest 123 yeahtest 123 yeahtest 123 yeah</div>

		<div>test 123 yeahtest 123 yeahtest 123 yeahtest 123 yeahtest 123 yeahtest 123 yeahtest 123 yeahtest 123 yeahtest 123 yeahtest 123 yeahtest 123 yeahtest 123 yeahtest 123 yeahtest 123 yeahtest 123 yeahtest 123 yeahtest 123 yeah</div>
		<div>test 123 yeahtest 123 yeahtest 123 yeahtest 123 yeahtest 123 yeahtest 123 yeahtest 123 yeahtest 123 yeahtest 123 yeahtest 123 yeahtest 123 yeahtest 123 yeahtest 123 yeahtest 123 yeahtest 123 yeahtest 123 yeahtest 123 yeah</div>
		<div>test 123 yeahtest 123 yeahtest 123 yeahtest 123 yeahtest 123 yeahtest 123 yeahtest 123 yeahtest 123 yeahtest 123 yeahtest 123 yeahtest 123 yeahtest 123 yeahtest 123 yeahtest 123 yeahtest 123 yeahtest 123 yeahtest 123 yeah</div>
		<div>test 123 yeahtest 123 yeahtest 123 yeahtest 123 yeahtest 123 yeahtest 123 yeahtest 123 yeahtest 123 yeahtest 123 yeahtest 123 yeahtest 123 yeahtest 123 yeahtest 123 yeahtest 123 yeahtest 123 yeahtest 123 yeahtest 123 yeah</div>
		<div>test 123 yeahtest 123 yeahtest 123 yeahtest 123 yeahtest 123 yeahtest 123 yeahtest 123 yeahtest 123 yeahtest 123 yeahtest 123 yeahtest 123 yeahtest 123 yeahtest 123 yeahtest 123 yeahtest 123 yeahtest 123 yeahtest 123 yeah</div>
		<div>test 123 yeahtest 123 yeahtest 123 yeahtest 123 yeahtest 123 yeahtest 123 yeahtest 123 yeahtest 123 yeahtest 123 yeahtest 123 yeahtest 123 yeahtest 123 yeahtest 123 yeahtest 123 yeahtest 123 yeahtest 123 yeahtest 123 yeah</div>
		<div>test 123 yeahtest 123 yeahtest 123 yeahtest 123 yeahtest 123 yeahtest 123 yeahtest 123 yeahtest 123 yeahtest 123 yeahtest 123 yeahtest 123 yeahtest 123 yeahtest 123 yeahtest 123 yeahtest 123 yeahtest 123 yeahtest 123 yeah</div>
		<div>test 123 yeahtest 123 yeahtest 123 yeahtest 123 yeahtest 123 yeahtest 123 yeahtest 123 yeahtest 123 yeahtest 123 yeahtest 123 yeahtest 123 yeahtest 123 yeahtest 123 yeahtest 123 yeahtest 123 yeahtest 123 yeahtest 123 yeah</div>
		<div>test 123 yeahtest 123 yeahtest 123 yeahtest 123 yeahtest 123 yeahtest 123 yeahtest 123 yeahtest 123 yeahtest 123 yeahtest 123 yeahtest 123 yeahtest 123 yeahtest 123 yeahtest 123 yeahtest 123 yeahtest 123 yeahtest 123 yeah</div>
		<div>test 123 yeahtest 123 yeahtest 123 yeahtest 123 yeahtest 123 yeahtest 123 yeahtest 123 yeahtest 123 yeahtest 123 yeahtest 123 yeahtest 123 yeahtest 123 yeahtest 123 yeahtest 123 yeahtest 123 yeahtest 123 yeahtest 123 yeah</div>

      </IonContent>
    </IonPage>
	);
}

export default Welcome;