import React, { useState, useRef, useEffect, useCallback } from 'react';

import { useSelector, useDispatch } from 'react-redux';
import { synchronizeWallet, showWalletModal } from "podfriend-approot/redux/actions/uiActions";

import Reward from 'react-rewards';

import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

import { FaRocket, FaCog, FaRegTimesCircle } from 'react-icons/fa';

import { format } from 'date-fns';

import SVG from 'react-inlinesvg';
// const BoostIcon = () => <SVG src={require('podfriend-approot/images/design/icons/boost.svg')} />;
const LoadingIcon = () => <SVG src={require('podfriend-approot/images/design/loading/loading-circle-white.svg')} />;

import EpisodeChapterList from 'podfriend-approot/components/Episode/Chapters/EpisodeChapterList.jsx';

import styles from './OpenPlayerUI.scss';

const TabPanel = ({ children }) => {
	return (
		<div>
			{ children }
		</div>
	);
};

const OpenPlayerUI = ({ activePodcast, activeEpisode, description, showNotes, chaptersLoading, chapters, currentChapter, playingValuePodcast, value4ValueEnabled, streamPerMinuteAmount, boostAmount, onBoost, setCurrentTime, showValueConfigModal }) => {
	const dispatch = useDispatch();

	const [tabIndex, setTabIndex] = useState('description');

	const [boostPending,setBoostPending] = useState(false);

	const isLoggedIn = useSelector((state) => state.user.isLoggedIn);
	const walletBalance = useSelector((state) => state.ui.walletBalance);

	const handleTabChange = (event, newValue) => {
		setTabIndex(newValue);
	};

	const onShowWalletModal = () => {
		dispatch(showWalletModal());
	};

	const onBoostClick = () => {
		setBoostPending(true);
		onBoost()
		.then((status) => {
			if (status.success === 1) {
				setBoostPending(false);
				rewardElement.current.rewardMe();
				dispatch(synchronizeWallet());
			}
			else {
				setBoostPending(false);
				console.log(status);
				rewardElement.current.punishMe();
			}
		})
		.catch((error) => {
			console.log('Error boosting');
		});
	};

	const activeEpisodeTime = activeEpisode.date ? format(new Date(activeEpisode.date),'MMM D, YYYY') : false;

	const rewardElement = useRef(null);

	const formatAmount = (number) => {
		if (isNaN(number)) {
			return number;
		}
		else {
			return number.toLocaleString();
		}
	};

	const descriptionElement = useRef(null);

	const handleDescriptionClicks = (event) => {
		event.preventDefault();
		event.stopPropagation();
		event.nativeEvent.stopImmediatePropagation();
		event.nativeEvent.preventDefault();

		console.log(event.target);

		if (event.target.tagName.toLowerCase() === 'a') {
			if (event.target.classList.contains('timestampLink')) {
				var timeStamp = event.target.innerHTML;
				console.log(timeStamp);

				var timeSplit = timeStamp.split(':'); // split it at the colons
				var seconds = 0, m = 1;
		
				while (timeSplit.length > 0) {
					seconds += m * parseInt(timeSplit.pop(), 10);
					m *= 60;
				}
				if (!isNaN(seconds)) {
					setCurrentTime(seconds);
				}
			}
			else {
				if (event.target.href) {
					window.open(event.target.href,'_blank','noopener');
				}
			}
		}
	};
/*
	const handleLinkClicks = useCallback((event) => {
		var source = event.target || event.srcElement;

		console.log(event);

		if (descriptionElement.current && descriptionElement.current.contains(source)) {
			event.preventDefault();
			event.stopImmediatePropagation();
			event.stopPropagation();
			event.cancelBubble = true;
			console.log('should be stopped');
		}
	},[]);

	useEffect(() => {
		console.log('adding event listener');
		document.getElementById('root').addEventListener('mouseup', handleLinkClicks);

		return () => {
			console.log('removing event listener');
			document.getElementById('root').removeEventListener('mouseup', handleLinkClicks);
		};
	},[handleLinkClicks]);
*/

	return (
		<div className={styles.episodeInfo}>
			<div style={{ position: 'relative' }} >
				{ isLoggedIn && playingValuePodcast && value4ValueEnabled &&
					<div
						className={styles.valueBar}
						style={{
							display: 'flex',
							width: '100%',
							// position: 'absolute',
							// bottom: '20px',
							justifyContent: 'center',
							alignItems: 'center',
							backgroundColor: 'var(--primary-color)'
						}}
					>
						<div
							className={styles.streamingSatsContainer}
							style={{ width: '80px', fontSize: '12px', textAlign: 'center', color: '#FFFFFF' }}
						>
								<div>{( walletBalance >= streamPerMinuteAmount ? streamPerMinuteAmount : 0)}</div>
								<div>sats/min</div>
						</div>
						<div style={{ textAlign: 'center', paddingRight: 10 }}>
							<Reward
								ref={rewardElement}
								type='confetti'
								config={{
									zIndex: 1000,
									lifeTime: 800
								}}
							>
								{/*<div className="button boostButton" style={{ width: '155px', textAlign: 'center' }} onClick={onBoostClick}><FaRocket style={{ fill: '#000000', opacity: '0.4'}} /> BOOST {formatAmount(boostAmount)}</div> */ }
								<div className={'button boostButton multiAction' + (boostPending ? ' pendingAction' : '')} style={{ width: '200px', textAlign: 'center', maxWidth: '300px' }}>
									{ boostPending === false &&
										<>
											{ walletBalance >= boostAmount &&
												<div className="buttonPrimaryAction" onClick={onBoostClick}>
													<FaRocket style={{ fill: '#FFFFFF', opacity: '0.8'}} /> BOOST {formatAmount(boostAmount)}
												</div>
											}
											{ walletBalance < boostAmount &&
												<div className="buttonPrimaryAction" onClick={onShowWalletModal}>
													<FaRegTimesCircle style={{ fill: '#FFFFFF', opacity: '0.8'}} /> FILL ME UP
												</div>
											}
										</>
									}
									{ boostPending === true &&
										<div className="buttonPrimaryAction">
											<LoadingIcon /> BOOSTING
										</div>
									}
									<div className="buttonSecondaryAction" onClick={showValueConfigModal}>
										<FaCog size="26" style={{ fill: '#FFFFFF', opacity: '0.5' }} />
									</div>
								</div>
							</Reward>
						</div>
					</div>
				}
				{/*
				<div
					style={{
						backgroundColor: 'var(--primary-color)',
						padding: '10px'
					}}
				>
						<div style={{
							backgroundColor: 'rgba(0,0,0,0.4)',
							padding: '5px',
							borderRadius: '5px'
						}}>
							Bar of controls
						</div>
				</div>
				*/}
				<div style={{ height: '80px', bottom: '1px', overflow: 'hidden' }} >
					<svg viewBox="0 0 500 150" preserveAspectRatio="none" style={{ height: '150px', width: '100%', backgroundColor: '#0176e5' }}>
						<path d="M-0.90,34.83 C167.27,-67.79 269.41,126.60 500.78,16.08 L503.61,86.15 L-0.33,87.14 Z" style={{ stroke: 'none', fill: '#FFFFFF' }} />
					</svg>
				</div>
			</div>
			<div className={styles.episodeMasterData}>
				Episode published: { activeEpisodeTime }
			</div>
			<div onClick={handleDescriptionClicks} ref={descriptionElement} className={styles.description} dangerouslySetInnerHTML={{__html:showNotes ? showNotes : description}} /> 
			{/*
			<Tabs
				style={{ position: 'relative', bottom: '2px' }}
				value={tabIndex}
				onChange={handleTabChange}
				TabIndicatorProps={{
					style: {
						backgroundColor: '#0176e5'
					}
				}}
			>
				<Tab label="Description" value="description" />

				{ chaptersLoading === true && 
					<Tab label="Chapters loading" value="chapters" />
				}
				{ chaptersLoading === false && chapters !== false &&
					<Tab label="Chapters" value="chapters" />
				}
			</Tabs>
			{ tabIndex === 'description' &&
				<TabPanel>
					<div className={styles.episodeMasterData}>
						Episode published: { activeEpisodeTime }
					</div>
					<div onClick={handleDescriptionClicks} ref={descriptionElement} className={styles.description} dangerouslySetInnerHTML={{__html:showNotes ? showNotes : description}} /> 
				</TabPanel>
			}
			{ tabIndex === 'chapters' &&
				<TabPanel>
					{ chaptersLoading === true &&
						<div>
							Fetching chapters for episode
						</div>
					}
					{ chapters !== false &&
						<EpisodeChapterList chapters={chapters} currentChapter={currentChapter} />
					}
				</TabPanel>
			}
			*/}
		</div>
	);
};
export default OpenPlayerUI;