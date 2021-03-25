import React, { useEffect, useState } from 'react';

import Modal from 'podfriend-approot/components/Window/Modal';

const InformationalModal = ({ title, text, image, button, shown, onClose }) => {
	return (
		<Modal
			onClose={onClose}
			header={image}
		>
			<div>
				<div>
					{text}
				</div>
			</div>
		</Modal>
	);
};

export default InformationalModal;