import React from 'react';

import SVG from 'react-inlinesvg';

import styles from './CreditCard.scss';
/**
Your current balance is: {(walletBalance).toLocaleString()} Satoshis.
*/
const CreditCard = ({ walletBalance, userName }) => {
	return (
		<div className={styles.card}>
			<SVG src={require('./../../images/logo/podfriend_logo.svg')} className={styles.logo} />
			<div className={styles.bankName}>PodFriend</div>
			<a className={styles.poweredBy}>{userName}</a>
			<div className={styles.chip}>
				<div className={styles.side + ' ' + styles.left}></div>
				<div className={styles.side + ' ' + styles.right}></div>
				<div className={styles.vertical + ' ' + styles.top}></div>
				<div className={styles.vertical + ' ' + styles.bottom}></div>
			</div>

			<div className={styles.balance}>{walletBalance === false ? 'Loading' : (walletBalance).toLocaleString()}</div>
			<div className={styles.balanceLabel}>Satoshi</div>

			<div className={styles.linesDown}></div>
			<div className={styles.linesUp}></div>
		</div>
	);
}

/*


			<div class="data">
				<div class="pan" title="4123 4567 8910 1112">4123 4567 8910 1112</div>
				<div class="first-digits">4123</div>
				<div class="exp-date-wrapper">
					<div class="left-label">EXPIRES END</div>
					<div class="exp-date">
						<div class="upper-labels">MONTH/YEAR</div>
						<div class="date" title="01/17">01/17</div>
					</div>
				</div>
				<div class="name-on-card" title="John Doe">John Doe</div>
			</div>

*/

export default CreditCard;