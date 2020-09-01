import React from 'react';
import { StyleSheet, Dimensions, View } from 'react-native';
import Video from 'react-native-video';

export const VideoPlayer = ({ source }) => {
  return (
    <View style={styles.container}>
      <Video
        source={source}
        style={styles.video}
        controls={true}
        resizeMode={'cover'}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ebebeb',
  },
  video: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').width * (9 / 16),
    backgroundColor: 'black',
  }
});
