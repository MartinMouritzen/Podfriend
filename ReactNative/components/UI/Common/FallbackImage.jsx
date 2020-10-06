import React from 'react';

import { Text, View, Image } from 'react-native';

var randomColor = require('randomcolor');

const noImageNoteText = 'Image failed loading';

class FallbackImage extends React.Component {
    constructor(props) {
        super(props);

        var customRandomColor = randomColor({
            seed: this.props.seed ? this.props.seed : this.props.noImageNote ? this.props.noImageNote : noImageNoteText,
            luminosity: 'bright'
        });

        this.state = {
            status: 'default',
            randomColor: customRandomColor
        };

        this.loadFallback = this.loadFallback.bind(this);
    }
    loadFallback() {
        this.setState({
            status: 'error'
        });
    }
    render() {
        if (this.state.status == 'error') {
            return (
                <View style={[this.props.style,{
                    flex: 1,
                    backgroundColor: this.state.randomColor,
                    justifyContent: 'center',
                    alignItems: 'center',
                    padding: 10
                }]}>
                    <Text numberOfLines={4} style={{ textAlign: 'center', color: '#FFFFFF', fontSize: 16, fontWeight: 'bold',   textShadowColor: 'rgba(0, 0, 0, 0.75)',
  textShadowOffset: {width: -1, height: 1},
  textShadowRadius: 10 }}>
                        {this.props.noImageNote ? this.props.noImageNote : noImageNoteText}
                    </Text>
                </View>
            );
		}
		else if (this.state.status == 'loading') {
			// Let's show a spinner here
		}
        else {
            return (
				<View style={[this.props.style,{ backgroundColor: '#FFFFFF' }]}>
					<Image
						{...this.props}
						onError={this.loadFallback}
					/>
				</View>
            );
        }
    }
}

export default FallbackImage;