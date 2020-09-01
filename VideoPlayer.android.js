import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Dimensions,
  View,
  TouchableOpacity,
  StatusBar,
  TouchableWithoutFeedback,
} from 'react-native';
import Video from 'react-native-video';
import Orientation from 'react-native-orientation-locker';
import { FullscreenClose, FullscreenOpen } from '../assets/icons';
import { PlayerControls, ProgressBar } from '../components';

export const VideoPlayer = ({ source }) => {
  const videoRef = React.createRef();
  const [state, setState] = useState({
    fullscreen: false,
    play: true,
    currentTime: 0,
    duration: 0,
    showControls: true,
  });

  useEffect(() => {
    Orientation.addOrientationListener(handleOrientation);
    return () => {
      Orientation.removeOrientationListener(handleOrientation);
    };
  }, []);

  return (
    <View style={state.fullscreen ? styles.container : [styles.container, { marginTop: StatusBar.currentHeight }]}>
      <TouchableWithoutFeedback onPress={showControls}>
        <View>
          <Video
            ref={videoRef}
            source={source}
            style={state.fullscreen ? styles.fullscreenVideo : styles.video}
            controls={false}
            resizeMode={'contain'}
            onLoad={onLoadEnd}
            onProgress={onProgress}
            onEnd={onEnd}
            paused={!state.play}
          />
          {state.showControls && (
            <View style={styles.controlOverlay}>
              <TouchableOpacity
                onPress={handleFullscreen}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                style={styles.fullscreenButton}>
                {state.fullscreen ? <FullscreenClose /> : <FullscreenOpen />}
              </TouchableOpacity>
              <PlayerControls
                onPlay={handlePlayPause}
                onPause={handlePlayPause}
                playing={state.play}
                showPreviousAndNext={false}
                showSkip={true}
                skipBackwards={skipBackward}
                skipForwards={skipForward}
              />
              <ProgressBar
                currentTime={state.currentTime}
                duration={state.duration > 0 ? state.duration : 0}
                onSlideStart={handlePlayPause}
                onSlideComplete={handlePlayPause}
                onSlideCapture={onSeek}
              />
            </View>
          )}
        </View>
      </TouchableWithoutFeedback>
    </View>
  );

  function handleOrientation(orientation) {
    orientation === 'LANDSCAPE-LEFT' || orientation === 'LANDSCAPE-RIGHT'
      ? (setState(s => ({ ...s, fullscreen: true })), StatusBar.setHidden(true))
      : (setState(s => ({ ...s, fullscreen: false })),
        StatusBar.setHidden(false));
  }

  function handleFullscreen() {
    state.fullscreen
      ? Orientation.lockToPortrait()
      : Orientation.lockToLandscape();
  }

  function handlePlayPause() {
    // If playing, pause and show controls immediately.
    if (state.play) {
      setState({ ...state, play: false, showControls: true });
      return;
    }

    setState({ ...state, play: true });
    setTimeout(() => setState(s => ({ ...s, showControls: false })), 2000);
  }

  function skipBackward() {
    let currentTime = state.currentTime - 15;
    if (currentTime < 0) {
      currentTime = 0;
    };
    videoRef.current.seek(currentTime);
    setState({ ...state, currentTime });
  }

  function skipForward() {
    let currentTime = state.currentTime + 15;
    if (currentTime > state.duration) {
      currentTime = state.duration;
    }
    videoRef.current.seek(currentTime);
    setState({ ...state, currentTime });
  }

  function onSeek(data) {
    videoRef.current.seek(data.seekTime);
    setState({ ...state, currentTime: data.seekTime });
  }

  function onLoadEnd(data) {
    setState(s => ({
      ...s,
      duration: data.duration,
      currentTime: data.currentTime,
    }));
  }

  function onProgress(data) {
    setState(s => ({
      ...s,
      currentTime: data.currentTime,
    }));
  }

  function onEnd() {
    setState({ ...state, play: false, currentTime: 0 });
    videoRef.current.seek(0);
  }

  function showControls() {
    state.showControls
      ? setState({ ...state, showControls: false })
      : setState({ ...state, showControls: true });
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000'
  },
  video: {
    height: Dimensions.get('window').height - StatusBar.currentHeight,
    width: Dimensions.get('window').width,
    backgroundColor: 'black',
  },
  fullscreenVideo: {
    height: Dimensions.get('window').width,
    width: Dimensions.get('window').height,
    backgroundColor: 'black',
  },
  fullscreenButton: {
    flex: 1,
    flexDirection: 'row',
    alignSelf: 'flex-end',
    alignItems: 'center',
    paddingRight: 10,
  },
  controlOverlay: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#000000c4',
    justifyContent: 'space-between',
  },
});
