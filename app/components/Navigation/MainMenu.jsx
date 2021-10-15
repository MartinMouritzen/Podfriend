import React, { useEffect, useRef, useState } from 'react';

import {
	IonPage,
	IonList,
	IonModal,
	IonMenu,
	IonHeader,
	IonToolbar,
	IonTitle,
	IonButtons,
	IonButton,
	IonItem,
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
	IonSplitPane
} from '@ionic/react';

import { Link } from 'react-router-dom';

import { FaRegEnvelope, FaWallet, FaUser, FaCog, FaComment, FaLock } from "react-icons/fa";

import { useDispatch, useSelector } from 'react-redux';

import { userLogout } from "~/app/redux/actions/userActions";
import { showWalletModal } from "~/app/redux/actions/uiActions";

const MainMenu = ({ showMenu, onDismiss, presentingElement }) => {
	const dispatch = useDispatch();
	const modal = useRef(null);

	return (
			<IonModal ref={modal} isOpen={showMenu} swipeToClose={true} onDidDismiss={onDismiss} showBackdrop={true} keyboardClose={true} backdropDismiss={true} presentingElement={presentingElement} mode='ios'>
				<IonHeader>
					<IonToolbar color="primary">
					<IonTitle>Menu</IonTitle>
						<IonButtons slot="end">
								<IonButton  />
							</IonButtons>
					</IonToolbar>
				</IonHeader>
				<IonContent>
					<IonList>
						<IonItem onClick={() => { dispatch(showWalletModal()); modal.current.dismiss(); }}><FaWallet /> Podcast Wallet</IonItem>
						<IonItem><Link to='/contact/'><FaRegEnvelope />Contact us</Link></IonItem>
						<IonItem onClick={() => { dispatch(userLogout()); modal.current.dismiss(); } }><FaLock /> Log out</IonItem>
					</IonList>
				</IonContent>
			</IonModal>
		
	);
};

export default MainMenu;