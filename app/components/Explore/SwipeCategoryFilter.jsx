import React, { useState } from 'react';

import { FaFilter } from 'react-icons/fa';

import styles from './SwipeExplorer.css';

const SwipeCategoryFilter = () => {
	const [showFilter,setShowFilter] = useState(false);

	const categories = {
		Arts: [
			'Books',
			'Design',
			'Fashion'
		],
		Business: [
			'Careers',
			'Entrepreneurship'
		]
	};

	return (
		<div className={styles.filterContainer + (showFilter ? ' ' + styles.activeFilterContainer : '')} onClick={() => { setShowFilter(!showFilter); }}>
			<div className={styles.filterLabel}>
				<FaFilter /> Filter
			</div>
			<div className={styles.filters}>
				{ Object.entries(categories).map(([categoryName, subCategories]) => {
					return (
						<div className={styles.filterCategory} key={categoryName}>
							<div className={styles.filterCategoryName}>
								<input type="checkbox" /> {categoryName}
							</div>
							<div className={styles.filterSubcategories}>
								{ subCategories.map((subcategoryName) => {
									return (
										<div className={styles.filterSubCategory} key={subcategoryName}>
											<input type="checkbox" /> {subcategoryName}
										</div>
									)
								} ) }
							</div>
						</div>
					)
				}) }
			</div>
		</div>
	)
};

export default SwipeCategoryFilter;