import React, { useEffect, useState } from 'react';

import Page from 'podfriend-approot/components/AppUI/Page/Page.jsx';
import PageHeader from 'podfriend-approot/components/AppUI/PageHeader/PageHeader.jsx';
import PageContent from 'podfriend-approot/components/AppUI/PageContent/PageContent.jsx';
import PageHeaderToolbar from 'podfriend-approot/components/AppUI/PageHeaderToolBar/PageHeaderToolbar.jsx';

import SearchField from 'podfriend-approot/components/Search/SearchField.jsx';

/**
*
*/
const Welcome = () => {
	return (
		<Page>
			<PageHeader>
				<PageHeaderToolbar>
					<h1>
						Podfriend
					</h1>
				</PageHeaderToolbar>
				<PageHeaderToolbar>
					<div style={{ display: 'flex', justifyContent: 'center' }}>
						<div style={{ maxWidth: '580px', width: '100%' }}>
							<SearchField />
						</div>
					</div>
				</PageHeaderToolbar>
			</PageHeader>
			<PageContent>
				<p>First paragraph</p>
				<p>test</p><p>test</p><p>test</p><p>test</p><p>test</p><p>test</p><p>test</p><p>test</p><p>test</p><p>test</p><p>test</p><p>test</p><p>test</p><p>test</p><p>test</p><p>test</p><p>test</p><p>test</p><p>test</p><p>test</p>
				<p>test</p><p>test</p><p>test</p><p>test</p><p>test</p><p>test</p><p>test</p><p>test</p><p>test</p><p>test</p><p>test</p><p>test</p><p>test</p><p>test</p><p>test</p><p>test</p><p>test</p><p>test</p><p>test</p><p>test</p>
				<p>test</p><p>test</p><p>test</p><p>test</p><p>test</p><p>test</p><p>test</p><p>test</p><p>test</p><p>test</p><p>test</p><p>test</p><p>test</p><p>test</p><p>test</p><p>test</p><p>test</p><p>test</p><p>test</p><p>test</p>
				<p>test</p><p>test</p><p>test</p><p>test</p><p>test</p><p>test</p><p>test</p><p>test</p><p>test</p><p>test</p><p>test</p><p>test</p><p>test</p><p>test</p><p>test</p><p>test</p><p>test</p><p>test</p><p>test</p><p>test</p>
				<p>test</p><p>test</p><p>test</p><p>test</p><p>test</p><p>test</p><p>test</p><p>test</p><p>test</p><p>test</p><p>test</p><p>test</p><p>test</p><p>test</p><p>test</p><p>test</p><p>test</p><p>test</p><p>test</p><p>test</p>
				<p>test</p><p>test</p><p>test</p><p>test</p><p>test</p><p>test</p><p>test</p><p>test</p><p>test</p><p>test</p><p>test</p><p>test</p><p>test</p><p>test</p><p>test</p><p>test</p><p>test</p><p>test</p><p>test</p><p>test</p>
			</PageContent>
		</Page>
	);
}

export default Welcome;