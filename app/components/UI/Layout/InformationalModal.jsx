import React, { useEffect, useState } from 'react';

import Modal from 'podfriend-approot/components/Window/Modal';

import styles from './InformationModal.scss';

const InformationalModal = ({ title, text, image, footer, shown, onClose }) => {
	return (
		<Modal
			onClose={onClose}
			header={image}
			footer={footer}
			defaultSnap={({ maxHeight }) => maxHeight - 30}
		>
			<div className={styles.informationModal}>
				{text}
			</div>
		</Modal>
	);
};

export default InformationalModal;