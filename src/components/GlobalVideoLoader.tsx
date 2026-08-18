import React from 'react';
import { View, StyleSheet, Dimensions, Platform, ActivityIndicator } from 'react-native';
import { useVideoPlayer, VideoView } from 'expo-video';
import SupermanLoader from './SupermanLoader';
import { COLORS } from '../constants/theme';

const { width, height } = Dimensions.get('window');

const GlobalVideoLoader: React.FC = () => {
  let player: any = null;
  if (Platform.OS !== 'web') {
    try {
      const videoSource = require('../assets/video/loder.mp4');
      player = useVideoPlayer(videoSource, (p) => {
        p.loop = true;
        p.play();
      });
    } catch (e) {
      player = null;
    }
  }

  return (
    <View style={styles.container}>
      {Platform.OS === 'web' || !player ? (
        <SupermanLoader text="Navigating..." />
      ) : (
        <VideoView
          style={styles.video}
          player={player}
          allowsFullscreen={false}
          allowsPictureInPicture={false}
          contentFit="cover"
          nativeControls={false}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 9999,
    elevation: 9999,
  },
  video: {
    width: width,
    height: height,
  },
});

export default GlobalVideoLoader;
