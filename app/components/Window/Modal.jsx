import React, { useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom'

import { BottomSheet } from 'react-spring-bottom-sheet';
import 'react-spring-bottom-sheet/dist/style.css'

import useMediaQuery from '@material-ui/core/useMediaQuery';

import styles from './Modal.scss';

/**
*
*/
const Modal = ({ shown = true, pageModal = false, onClose, title, children, useBlur, hideModalCallback, defaultSnap, snapPoints, header, footer, onlyBottomSheet }) => {
	const portalElement = useRef(null);
	const [isReadyToDisplay, setIsReadyToDisplay] = useState(false);
	const matches = useMediaQuery('(max-width:600px)');

	const [hiding,setHiding] = useState(false);
	const [hidden,setHidden] = useState(false);

	useEffect(() => {
		portalElement.current = document.createElement('div');
		document.body.appendChild(portalElement.current);

		setIsReadyToDisplay(true);

		return () => {
			document.body.removeChild(portalElement.current);
		};
	},[]);

	const hideModal = () => {
		setHidden(true);

		if (onClose) {
			onClose();
		}
	}

	useEffect(() => {
		console.log('shown changed: ' + shown);
		setHidden(!shown);
	},[shown]);

	const startHidingModal = () => {
		if (hideModalCallback) {
			var shouldHide = hideModalCallback();
		}
		else {
			setHiding(true);
			setTimeout(hideModal,500);
		}
	};

	const extraObject = false;
	// const extraObject = { onLogin: this.hideModal };

	let modalOuterClasses = (hiding ? [styles.modalOuterHiding].join(' ') : styles.modalOuter);

	if (pageModal) {
		modalOuterClasses = (hiding ? [styles.pageModalOuterHiding].join(' ') : styles.pageModalOuter);
	}

	const childContent = (
		<>
			{ title &&
				<h1 className="modalTitle">{title}</h1>
			}
			{React.cloneElement(children, extraObject )}
		</>
	);

	const defaultSnapFunction = ({ maxHeight }) => {
		return maxHeight - 30;
	};

	if (isReadyToDisplay) {

		return ReactDOM.createPortal(
			<>
				<BottomSheet
					data-body-scroll-lock-ignore="true"
					open={onlyBottomSheet || matches}
					onDismiss={onClose}
					style={{ zIndex: 11 }}
					header={header}
					footer={footer}
					defaultSnap={defaultSnap ? defaultSnap : defaultSnapFunction}
					snapPoints={snapPoints}
				>
					<div className="bottomSheet podfriendModal">
						{childContent}
					</div>
				</BottomSheet>
				{ !matches && !onlyBottomSheet &&
					<div className={modalOuterClasses + ' podfriendModal'}
						onClick={(event) => { event.stopPropagation(); startHidingModal();  } }
						style={{ touchAction: 'none', backdropFilter: useBlur ? 'grayscale(50%) blur(2px)' : 'none', display: hidden ? 'none' : 'flex' }}
						onTouchStart={(event) => { event.preventDefault(); event.stopPropagation(); }}
						onTouchMove={(event) => { event.preventDefault(); event.stopPropagation(); }}
						onDrag={(event) => { event.preventDefault(); event.stopPropagation(); }}
					>
						<div className={styles.modalInner} onClick={(event) => { event.stopPropagation(); }}>
							<div className={styles.modal + ' modal'} onClick={(event) => { event.stopPropagation(); } } >
								{ header }
								{childContent}
								{ footer }
							</div>
						</div>
					</div>
				}
			</>
		, portalElement.current);
	}
	else {
		return null;
	}
}

export default Modal;