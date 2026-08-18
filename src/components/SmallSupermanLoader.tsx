import React from 'react';
import { ActivityIndicator, View } from 'react-native';

interface SmallSupermanLoaderProps {
  color?: string;
}

const SmallSupermanLoader: React.FC<SmallSupermanLoaderProps> = ({ color = "#FFFFFF" }) => {
  return (
    <View style={{ justifyContent: 'center', alignItems: 'center' }}>
      <ActivityIndicator size="small" color={color} />
    </View>
  );
};

export default SmallSupermanLoader;
