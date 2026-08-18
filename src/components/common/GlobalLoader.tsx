import React, { useEffect } from 'react';
import { View, StyleSheet, Modal, Platform, ActivityIndicator } from 'react-native';
import { useVideoPlayer, VideoView } from 'expo-video';
import { useLoading } from '../../contexts/LoadingContext';
import SupermanLoader from '../SupermanLoader';
import { COLORS } from '../../constants/theme';

export const GlobalLoader: React.FC = () => {
  const { isLoading } = useLoading();

  let player: any = null;
  if (Platform.OS !== 'web') {
    try {
      player = useVideoPlayer(require('../../assets/videos/loader.mp4'), (p) => {
        p.loop = true;
        p.muted = true;
      });
    } catch (e) {
      player = null;
    }
  }

  useEffect(() => {
    if (isLoading && player && Platform.OS !== 'web') {
      try {
        player.muted = true;
        player.volume = 0;
        player.currentTime = 0;
        player.play();
      } catch (e) {
        // Fallback
      }
    }
  }, [isLoading, player]);

  if (!isLoading) return null;

  return (
    <Modal transparent={true} visible={isLoading} animationType="fade">
      <View style={styles.overlay}>
        {Platform.OS === 'web' || !player ? (
          <View style={styles.webFallbackContainer}>
            <SupermanLoader text="Loading Donor Junction..." />
          </View>
        ) : (
          <VideoView
            player={player}
            style={styles.video}
            contentFit="cover"
            nativeControls={false}
          />
        )}
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  webFallbackContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  video: {
    width: '100%',
    height: '100%',
  },
});
