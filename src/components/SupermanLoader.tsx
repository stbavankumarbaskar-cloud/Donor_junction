import React, { useEffect, useRef } from 'react';
import { View, Animated, Easing, StyleSheet, Text } from 'react-native';

interface SupermanLoaderProps {
  text?: string;
}

const SupermanLoader: React.FC<SupermanLoaderProps> = ({ text = "Loading..." }) => {
  const flyAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(flyAnim, {
          toValue: 1,
          duration: 800,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(flyAnim, {
          toValue: 0,
          duration: 800,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        })
      ])
    ).start();
  }, [flyAnim]);

  const translateY = flyAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -15],
  });

  return (
    <View style={styles.container}>
      <Animated.Image
        source={require('../assets/images/blood_superman.png')}
        style={[styles.image, { transform: [{ translateY }] }]}
        resizeMode="contain"
      />
      <Text style={styles.text}>{text}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  image: {
    width: 220,
    height: 134,
    marginBottom: 24,
  },
  text: {
    color: '#DA0037',
    fontWeight: 'bold',
    fontSize: 18,
    textAlign: 'center',
  }
});

export default SupermanLoader;
