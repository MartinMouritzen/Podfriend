import React, { useState } from 'react';

import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

import { format } from 'date-fns';

import EpisodeChapterList from 'podfriend-approot/components/Episode/Chapters/EpisodeChapterList.jsx';

import styles from './OpenPlayerUI.scss';

const TabPanel = ({ children }) => {
	return (
		<div>
			{ children }
		</div>
	);
};

const OpenPlayerUI = ({ activePodcast, activeEpisode, description, chaptersLoading, chapters, currentChapter }) => {

	const [tabIndex, setTabIndex] = useState('description');

	const handleTabChange = (event, newValue) => {
		setTabIndex(newValue);
	};

	const activeEpisodeTime = activeEpisode.date ? format(new Date(activeEpisode.date),'MMM D, YYYY') : false;

	return (
		<div className={styles.episodeInfo}>
			<div style={{ height: '80px', overflow: 'hidden' }} >
				<svg viewBox="0 0 500 150" preserveAspectRatio="none" style={{ height: '150px', width: '100%', backgroundColor: '#0176e5' }}>
					<path d="M-0.90,34.83 C167.27,-67.79 269.41,126.60 500.78,16.08 L503.61,86.15 L-0.33,87.14 Z" style={{ stroke: 'none', fill: '#FFFFFF' }} />
				</svg>
			</div>

			<Tabs
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
					<div className={styles.description} dangerouslySetInnerHTML={{__html:description}} /> 
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
		</div>
	);
};
export default OpenPlayerUI;