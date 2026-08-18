import React from 'react';
import { View, StyleSheet } from 'react-native';
import SupermanLoader from './SupermanLoader';

const GlobalVideoLoader: React.FC = () => {
  return (
    <View style={styles.container}>
      <SupermanLoader text="Navigating..." />
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
});

export default GlobalVideoLoader;
