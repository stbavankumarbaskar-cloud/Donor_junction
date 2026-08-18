import React from 'react';
import { View, StyleSheet, Modal } from 'react-native';
import { useLoading } from '../../contexts/LoadingContext';
import SupermanLoader from '../SupermanLoader';

export const GlobalLoader: React.FC = () => {
  const { isLoading } = useLoading();

  if (!isLoading) return null;

  return (
    <Modal transparent={true} visible={isLoading} animationType="fade">
      <View style={styles.overlay}>
        <SupermanLoader text="Loading Donor Junction..." />
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
});
