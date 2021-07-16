import React from 'react';

import PodcastPage from 'podfriend-approot/components/Page/PodcastPage.jsx';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // You can also log the error to an error reporting service
    // logErrorToMyService(error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
		<PodcastPage title="Something went wrong" pageType="landingPage">
			<div className="hero">
				<h2>Oh no</h2>
	  			<h1>Something went wrong</h1>
			</div>
			<div className="pageContent">
				<div style={{ padding: 20, paddingTop: 0 }}>
					<p>
						An error happened that was not handled. It's time to blame the programmer of Podfriend for not being able to see into the future and handle all cases!
					</p>
				</div>
			</div>
		</PodcastPage>
	  );
    }

    return this.props.children; 
  }
}
export default ErrorBoundary;