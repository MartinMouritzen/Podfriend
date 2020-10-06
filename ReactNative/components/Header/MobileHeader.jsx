import React from 'react';
import { TouchableHighlight, View, Image } from 'react-native';
import { Text, Icon, Button, Spinner } from 'native-base';

import SearchHeader from './SearchHeader.jsx';

class MobileHeader extends React.Component {
	constructor(props) {
        super(props);

        this.state = {
            scrollY: 0
        };
    }

    render() {
        return (
            <>
                <View style={{

                }}>
                    { true && 
                        <SearchHeader openDrawer={this.props.onOpenDrawer} />
                    }
                </View>

            </>
        );
    }
}

export default MobileHeader;