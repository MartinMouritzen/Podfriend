import React, { useState, useEffect } from 'react';

import styles from './Modal.scss';

/**
*
*/
const Modal = ({ shown = true, pageModal = false, onClose, title, children, useBlur, hideModalCallback }) => {
	const [hiding,setHiding] = useState(false);
	const [hidden,setHidden] = useState(false);

	const hideModal = () => {
		setHidden(true);

		if (onClose) {
			onClose();
		}
	}

	useEffect(() => {
		console.log('shown changed');
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

	return (
		<div className={modalOuterClasses}
			onClick={(event) => { event.stopPropagation(); startHidingModal();  } }
			style={{ touchAction: 'none', backdropFilter: useBlur ? 'grayscale(50%) blur(2px)' : 'none', display: hidden ? 'none' : 'flex' }}
			onTouchStart={(event) => { event.preventDefault(); event.stopPropagation(); }}
			onTouchMove={(event) => { event.preventDefault(); event.stopPropagation(); }}
			onDrag={(event) => { event.preventDefault(); event.stopPropagation(); }}
		>
			<div className={styles.modalInner}>
				<div className={styles.modal + ' modal'} onClick={(event) => { event.stopPropagation(); } } >
					{ title &&
						<h1 className="modalTitle">{title}</h1>
					}
					{React.cloneElement(children, extraObject )}
				</div>
			</div>
		</div>
	);
}

export default Modal;