import React from 'react';

import Carousel, { Pagination } from 'react-native-snap-carousel';

import { Link } from 'react-router-alias';

import { Dimensions, ScrollView, View, Image } from 'react-native';
import { Text } from 'native-base';

import FallbackImage from './../Common/FallbackImage.jsx';

class PodcastMatrixUI extends React.Component {
	constructor(props) {
		super(props);
		
		this.renderCarousel = this.renderCarousel.bind(this);
		this.renderList = this.renderList.bind(this);
	}
	render() {
		if (this.props.type && this.props.type == 'carousel') {
			return this.renderCarousel();
		}
		else {
			return this.renderList();
		}
	}
	renderList() {
		const thumbNailSize = 160;
		return (
			<ScrollView horizontal={true} style={{ height: 250, paddingLeft: 15 }}>
				{ this.props.podcasts.map((item,index) => {
					return (
						<Link
							to={{ pathname: '/podcast/' + item.path, state: { podcast: item } }}
							underlayColor="#0176e5"
							key={item.path}
							style={{
								paddingRight: 7,
								paddingLeft: 7,
								height: 170,
								borderRadius: 15
							}}
						>
							<View
								style={{
									width: thumbNailSize,
									height: thumbNailSize
								}}
							>
								<View
									style={{
										width: thumbNailSize,
										height: thumbNailSize,
										overflow: 'hidden',
										borderRadius: 10,
										elevation: 5
									}}
								>
									<FallbackImage noImageNote={item.name} key='coverImage' style={{ width: thumbNailSize, height: thumbNailSize }} source={{ uri: item.artworkUrl600 }} />
								</View>
								<View style={{ flex: 1, marginTop: 12, marginLeft: 4, marginRight: 4 }}>
									<Text numberOfLines={2} style={{ fontSize: 16, color: 'rgba(14,70,157,1)',fontFamily: 'Roboto_medium',  lineHeight: 16 }}>{ item.name }</Text>
									<Text numberOfLines={1} style={{ fontSize: 14, color: 'rgba(14,70,157,0.8)' }}>{ item.author }</Text>
								</View>
							</View>
						</Link>
					);
				}) }
			</ScrollView>
		);
	}	
	_renderCarouselItem = ({item, index}) => {
		return (
			<View
				style={{

				}}>
				<Image style={{ width: 230, height: 200 }} source={{ uri: item.artworkUrl600 }} />
				<View style={{ padding: 10 }}>
					<Text header numberOfLines={2}>{ item.name }</Text>
					<Text secondary numberOfLines={1}>{ item.author }</Text>
				</View>
			</View>
		);
	}
	renderCarousel() {
		const screenWidth = Math.round(Dimensions.get('window').width);
		
		return (
			<View>
				<Carousel
					ref={(c) => { this._carousel = c; }}
					data={this.props.podcasts}
					renderItem={this._renderCarouselItem}
					sliderWidth={screenWidth}
					decelerationRate ={'fast'}
					slideStyle={{
	 					backgroundColor:'#FFFFFF',
						borderRadius: 5,
						padding: 10,
						shadowColor: "#000",
						shadowOffset: {
							width: 0,
							height: 2,
						},
						shadowOpacity: 0.25,
						shadowRadius: 3.84,
						elevation: 5,
						width: 250,
						height: 290,
						overflow: 'hidden'
					}}
					containerCustomStyle={{
						height: 300
					}}
					itemWidth={250}
					itemHeight={350}
					sliderHeight={360}
					layout={'default'}
				/>
				<Pagination
					dotsLength={this.props.podcasts.length}
				/>
			</View>
		);
	}
}
export default PodcastMatrixUI;