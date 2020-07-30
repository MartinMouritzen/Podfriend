import React from 'react';
import { View, Text, StyleSheet, TouchableWithoutFeedback } from 'react-native';
import TrackPlayer, { ProgressComponent } from 'react-native-track-player';

import TimeUtil from 'podfriend-approot/library/TimeUtil.js';

class ProgressBar extends ProgressComponent {

    render() {
        // const position = TimeUtil.formatPrettyDurationText(Math.floor(this.state.position));
        // const duration = TimeUtil.formatPrettyDurationText(Math.floor(this.state.duration));
        // const info = position + ' / ' + duration;

        let progress = this.getProgress() * 100;
        let buffered = this.getBufferedProgress() * 100;
        buffered -= progress;
        if(buffered < 0) buffered = 0;

        return (
            <View style={styles.bar}>
                <View style={[{width: progress + '%'}, styles.played]} />
                <View style={[{width: buffered + '%'}, styles.buffered]} />
            </View>
        );
    }
	shouldComponentUpdate(nextProps, nextState) {
		const {
			duration: prevDuration,
			position: prevPosition,
			bufferedPosition: prevBufferedPosition
		} = this.state;

		const {
			duration: nextDuration,
			position: nextPosition,
			bufferedPosition: nextBufferedPosition
		} = nextState;

		if(prevDuration !== nextDuration || prevPosition !== nextPosition || prevBufferedPosition !== nextBufferedPosition) {
			return true;
		}
		return false;
	}
}

const styles = StyleSheet.create({
    bar: {
        backgroundColor: '#575757',
        height: 3,
        width: '100%',
        flexDirection: 'row',
        alignItems: 'flex-start'
    },
    played: {
        backgroundColor: '#28bd72',
        height: 3
    },
    buffered: {
        backgroundColor: '#797979',
        height: 3
    }
});

module.exports = ProgressBar;