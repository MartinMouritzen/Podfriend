import React from 'react';

import { View, ScrollView } from 'react-native';

import SearchResult from './SearchResult.jsx';

// import { Text, Avatar, Button, Card, Title, Paragraph } from 'react-native-paper';
import { Card, CardItem, Text, Icon, Button, Spinner, H1 } from 'native-base';

class SearchUI extends React.Component {
	render() {
		return (
			<ScrollView style={{ flex: 1 }} contentContainerStyle={{ flexGrow: 1 }}>
				{ !this.props.query &&
					<Text>
						Recent searches
					</Text>
				}
				{ this.props.query &&
					<View style={{ flex: 1, padding: 10 }}>
						{ !this.props.searching && this.props.searchType == 'podcast' &&
							<H1>Search results for &quot;{this.props.query}&quot;</H1>
						}
						{ !this.props.searching && this.props.searchType == 'author' &&
							<H1>Podcasts by {this.props.query}</H1>
						}
						{ this.props.searchError &&
								<Text>
									{this.props.searchError}
								</Text>
						}
						{ this.props.searchGenres && this.props.searchGenres.length > 0 &&
							<Text>
								Only show podcasts in
									
							</Text>
						}		
						{ !this.props.searchError && this.props.searching &&
							<View style={{ flex: 1, alignItems: 'center', justifyContent: 'center'}}>
								<Spinner color="#0176e5" />
								<Text>Loading search results</Text>
							</View>
						}
						{ !this.props.searchError && !this.props.searching && this.props.searchResults && this.props.searchResults.length > 0 &&
							this.props.searchResults.map((result,index) => {
								var showResult = false;
								if (!this.props.selectedGenres || this.props.selectedGenres.length == 0) {
									showResult = true;
								}
								else if (this.props.selectedGenres && this.props.selectedGenres.length > 0)  {
									if (result.genres && result.genres.length > 0) {
										result.genres.forEach((genre) => {
											if (this.props.selectedGenres.includes(genre)) {
												showResult = true;
											}
										});
									}
								}
								if (showResult) {	
									return (
										<SearchResult key={index} result={result} />
									)
								}
							})
						}
						{ !this.props.searching && this.props.searchResults && this.props.searchResults.length === 0 && 
							<Text>
								No results found.
							</Text>
						}
					</View>
				}
			</ScrollView>
		);
	}
}
export default SearchUI;