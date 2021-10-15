import React, { useEffect, useState } from 'react';

import { useSelector, useDispatch } from 'react-redux';
import { showWalletModal } from 'podfriend-approot/redux/actions/uiActions.js';

import styles from 'podfriend-approot/components/Navigation/BottomNavigation.scss';

import { Link, matchPath, useLocation } from 'react-router-dom';

import {
	FaHome,
	FaRegLightbulb, FaLightbulb,
	FaThLarge,
	FaSearch,
	FaWallet
} from "react-icons/fa";
/**
*
*/
const BottomNavigation = () => {
	const dispatch = useDispatch();
	let location = useLocation();
	const [iconSelected,setIconSelected] = useState(false);

	const walletBalance = useSelector((state) => state.ui.walletBalance);
	const showingWalletModal = useSelector((state) => state.ui.showWalletModal);
	const value4ValueEnabled = useSelector((state) => state.settings.value4ValueEnabled);

	const onShowWalletModal = () => {
		dispatch(showWalletModal());
	};

	useEffect(() => {
		setIconSelected(false);
		const isHome = matchPath(location.pathname, {
			path: "/",
			exact: true,
			strict: false
		});
		if (isHome && isHome.isExact) {
			setIconSelected('home');
		}
		const isPodfrndr = matchPath(location.pathname, {
			path: "/podfrndr",
			exact: true,
			strict: false
		});
		if (isPodfrndr && isPodfrndr.isExact) {
			setIconSelected('podfrndr');
		}

		const isFavorites = matchPath(location.pathname, {
			path: "/favorites",
			exact: true,
			strict: false
		});
		if (isFavorites && isFavorites.isExact) {
			setIconSelected('favorites');
		}

		const isSearch = matchPath(location.pathname, {
			path: "/search",
			exact: true,
			strict: false
		});
		if (isSearch && isSearch.isExact) {
			setIconSelected('search');
		}
	},[location.pathname]);

	return (
		<div className={styles.bottomNavigation}>
			<Link to='/' className={styles.menuItem + (iconSelected === 'home' ? ' ' + styles.menuItemSelected : '')}>
				<FaHome size="25" /><br />
				Home
			</Link>
			<Link to='/podfrndr/' className={styles.menuItem + (iconSelected === 'podfrndr' ? ' ' + styles.menuItemSelected : '')}>
				{ iconSelected === 'podfrndr' &&
					<FaLightbulb size="25" />
				}
				{ iconSelected !== 'podfrndr' &&
					<FaRegLightbulb size="25" />
				}
				<br />
				Discover
			</Link>
			{/*
			<Link to='/favorites/' className={styles.menuItem + (iconSelected === 'favorites' ? ' ' + styles.menuItemSelected : '')}>
				<FaThLarge size="25" /><br />
				Queue
			</Link>
			*/}
			<Link to='/favorites/' className={styles.menuItem + (iconSelected === 'favorites' ? ' ' + styles.menuItemSelected : '')}>
				<FaThLarge size="25" /><br />
				Podcasts
			</Link>
			{ value4ValueEnabled &&
				<div
					className={styles.menuItem + (iconSelected === 'wallet' ? ' ' + styles.menuItemSelected : '')}
					onClick={onShowWalletModal}
				>
					<FaWallet size="25" /><br />
					{ walletBalance === false &&
						<>Loading</>
					}
					{ walletBalance !== false && typeof walletBalance !== 'undefined' &&
						<>
							{(walletBalance).toLocaleString()}
						</>
					}
				</div>
			}
			{/*
			<Link to='/search/' className={styles.menuItem + (iconSelected === 'search' ? ' ' + styles.menuItemSelected : '')}>
				<FaSearch size="25" /><br />
				Search
			</Link>
			*/}
		</div>
	);
}

export default BottomNavigation;