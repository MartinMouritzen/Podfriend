import React, { Component } from 'react';

import styles from './TextInput.css';

/**
*
*/
class TextInput extends Component {
	/**
	*
	*/
	constructor(props) {
		super(props);
		
		if (!props.id) {
			throw new Error('TextInput expected an id but none was sent throught props');
		}

		this.state = {
			active: (props.value && props.value.length > 0)
		};

		this.onFocus = this.onFocus.bind(this);
		this.onBlur = this.onBlur.bind(this);
	}

	onFocus(event) {
		this.setState({ active: true });
		if (this.props.onFocus) {
			this.props.onFocus(event);
		}
	}
	onBlur(event) {
		this.setState({ active: event.target.value.length !== 0 });
		if (this.props.onBlur) {
			this.props.onBlur(event);
		}
	}
	componentDidMount(){
		if (this.props.focus) {
			this.nameInput.focus();
		}
	}
	/**
	*
	*/
	render() {
		const { id, placeholder, onBlur, onFocus, type, refs, className, autocomplete, ...otherProps } = this.props;
		
		return (
			<div className={(this.state.active ? [styles.TextInputContainer,styles.TextInputContainerActive].join(' ') : [styles.TextInputContainer,styles.TextInputContainerInactive].join(' '))}>
				<label htmlFor={id}>
					{placeholder}
				</label>
				<input
					className={className}
					id={id}
					onBlur={this.onBlur}
					onFocus={this.onFocus}
					ref={refs}
					type={type}
					autocomplete={autocomplete}
					{...otherProps}
					ref={(input) => { this.nameInput = input; }}
				/>
			</div>
		);
	}
}
export default TextInput;