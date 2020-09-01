import React from 'react';
import { ImageBackground } from 'react-native';
import { VideoPlay } from '../assets/icons';

export const VideoThumbnail = ({ source, height, width, resizeMode, iconSize }) => (
  <ImageBackground resizeMode={resizeMode} source={source} style={{
    width,
    height,
    justifyContent: 'center',
    alignItems: 'center',
  }}>
    <VideoPlay width={iconSize} height={iconSize} />
  </ImageBackground>
);
