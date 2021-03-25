import React, { useEffect, useState } from 'react';

import InformationalModal from 'podfriend-approot/components/UI/Layout/InformationalModal.jsx';

import SVG from 'react-inlinesvg';
// const ValueInfographic = () => <SVG src={require('podfriend-approot/images/design/onboarding/value4value.png')} />;
import ValueInfographic from 'podfriend-approot/images/design/onboarding/value4value.png';

const Value4ValueModal = () => {

	const [shown,setShown] = useState(true);

	const onClose = () => {
		setShown(false);
	};

	const [section,setSection] = useState(1);

	if (shown) {
		return (
			<InformationalModal
				image={<img src={ValueInfographic} />}
				title={'Support this podcast'}
				onClose={onClose}
				shown={shown}
				text={
					<>
						{ section === 1 &&
							<section>
								<p>
									You're listening to a Podcast that allows you to show appreciation of their content by donating while listening.
								</p>
							</section>
						}
						{ section === 2 &&
							<section>
								<p>
									This means that you can enable a &quot;Podcast Wallet&quot; in Podfriend.
									You can put a bit of crypto currency in this wallet and slowly stream this to the Podcast while listening.
								</p>
							</section>
						}
						{ section === 2 &&
							<section>
								<h3>Why should I bother?</h3>
								<p>
									Not only does it help minimize ads, but showing your support of your favorite podcasts, is a great way to ensure that you keep getting valuable content to listen to.
								</p>
							</section>
						}
					</>
				}
				button={<button>Great!</button>}
			/>
		);
	}
	else {
		return null;
	}
};

export default Value4ValueModal;