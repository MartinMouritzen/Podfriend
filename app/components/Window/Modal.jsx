import React, { Component } from 'react';

import styles from './Modal.css';

/**
*
*/
class Modal extends Component {
	/**
	*
	*/
	constructor(props) {
		super(props);
		this.state = {
			hiding: false,
			hidden: false
		};
		this.hideModal = this.hideModal.bind(this);
	}
	hideModal() {
		this.setState({
			hidden: true
		},this.props.onClose);
	}
	render() {
		return (
			<React.Fragment>
			{ !this.state.hidden && 
				<div className={(this.state.hiding ? [styles.modalOuterHiding].join(' ') : styles.modalOuter)} onClick={() => { this.setState({ hiding: true },() => { setTimeout(this.hideModal,500) }); } }>
					<div className={styles.modalInner}>
						<div className={styles.modal} onClick={(event) => { event.stopPropagation(); } }>
							{/* this.props.children */}
							{React.cloneElement(this.props.children, { onLogin: this.hideModal })}
						</div>
					</div>
				</div>
			}
			</React.Fragment>
		);
	}
}

export default Modal;