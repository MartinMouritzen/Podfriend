
import React from 'react';

import styles from './Header.scss';

const Header = () => {
	return (
		<div className={styles.header}>
			header test
		</div>
	);
};

export default Header;
/*
import React, { Component } from 'react';
import PropTypes from 'prop-types';

class Sticky extends Component {
  static baseClass = 'tk-sticky'

  state = {
    height: 0,
    width: 0,
    stuckBottom: false,
    stuckLeft: false,
    stuckRight: false,
    stuckTop: false,
  }

  componentDidMount() {
    this.addEvents();
    this.handleScroll();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.scrollTarget !== this.props.scrollTarget) {
      this.removeEvents();
      this.addEvents();
    }
  }

  componentWillUnmount() {
    this.removeEvents();
  }

  frameId = 0

  stickyDiv = React.createRef();

  handleScroll = () => {
    const { sides } = this.props;
    const stickyDiv = this.stickyDiv.current || null;
    const scrollTarget = this.props.scrollTarget || window;

    this.frameId = 0;

    if (!stickyDiv) {
      return;
    }

    let scrollRect = { // scrollTarget is the window
      height: scrollTarget.innerHeight,
      width: scrollTarget.innerWidth,
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
      x: scrollTarget.scrollX,
      y: scrollTarget.scrollY,
    };

    if (scrollTarget.getBoundingClientRect) { // scrollTarget is not the window
      scrollRect = scrollTarget.getBoundingClientRect();
    }

    let stickyRect = stickyDiv.getBoundingClientRect();

    if (!this.state.height || !this.state.width) {
      this.setState({
        height: stickyRect.height,
        width: stickyRect.height,
      });
    }

    stickyRect = { // Apparently you can't spread the results of a bounding client rectangle
      height: this.state.height || stickyRect.height,
      width: this.state.width || stickyRect.width,
      x: stickyRect.x,
      y: stickyRect.y,
    };

    if (typeof sides.bottom === 'number') {
      if (stickyRect.y + stickyRect.height > (scrollRect.height + scrollRect.top) - sides.bottom) {
        this.setState({ stuckBottom: true });
      } else {
        this.setState({ stuckBottom: false });
      }
    }

    if (typeof sides.top === 'number') {
      if (stickyRect.y < scrollRect.top + sides.top) {
        this.setState({ stuckTop: true });
      } else {
        this.setState({ stuckTop: false });
      }
    }

    if (typeof sides.left === 'number') {
      if (stickyRect.x < scrollRect.left + sides.left) {
        this.setState({ stuckLeft: true });
      } else {
        this.setState({ stuckLeft: false });
      }
    }

    if (typeof sides.right === 'number') {
      if (stickyRect.x + stickyRect.width > (scrollRect.width + scrollRect.left) - sides.right) {
        this.setState({ stuckRight: true });
      } else {
        this.setState({ stuckRight: false });
      }
    }
  }

  debouncedScroll = () => {
    if (!this.frameId) {
      const frameId = requestAnimationFrame(this.handleScroll);
      this.frameId = frameId;
    }
  }

  addEvents() {
    const scrollTarget = this.props.scrollTarget || window;

    if (scrollTarget && this.stickyDiv.current) {
      scrollTarget.addEventListener('scroll', this.debouncedScroll);
    }
  }

  removeEvents() {
    const scrollTarget = this.props.scrollTarget || window;

    if (scrollTarget) {
      scrollTarget.removeEventListener('scroll', this.debouncedScroll);
    }

    if (this.frameId) {
      cancelAnimationFrame(this.frameId);
    }
  }

  render() {
    const { children } = this.props;
    const { stuckBottom, stuckLeft, stuckRight, stuckTop } = this.state;

    const stickyModifiers = [];

    if (stuckBottom) {
      stickyModifiers.push('stuck-bottom');
    }

    if (stuckLeft) {
      stickyModifiers.push('stuck-left');
    }

    if (stuckRight) {
      stickyModifiers.push('stuck-right');
    }

    if (stuckTop) {
      stickyModifiers.push('stuck-top');
    }

    const childrenWithStuckProps = React.Children.map(children, (child) => {
      const childModifiers = (child.props && child.props.modifiers) || [];
      return React.cloneElement(child, { modifiers: [...childModifiers, ...stickyModifiers] });
    });

    return (
      <div
        className={Sticky.baseClass}
        ref={this.stickyDiv}
      >
        {childrenWithStuckProps}
      </div>
    );
  }
}

Sticky.propTypes = {
  // Pass in a React component, and it will receive `stuckBottom`, `stuckLeft`, `stuckRight`, and/or `stuckTop` modifiers
  children: PropTypes.node.isRequired,
  // If you have an internally scrolling component, pass its ref callback to watch for scroll events
  scrollTarget: PropTypes.object,
  // These offsets determine how far from the edge of the page an element must be to count as 'stuck'
  sides: PropTypes.shape({
    bottom: PropTypes.number,
    left: PropTypes.number,
    right: PropTypes.number,
    top: PropTypes.number,
  }),
};

Sticky.defaultProps = {
  scrollTarget: null,
  sides: {
    top: 0,
  },
};

export default Sticky;
*/