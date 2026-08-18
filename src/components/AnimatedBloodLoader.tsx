import React, { useEffect, useRef } from 'react';
import {
  View,
  StyleSheet,
  Animated,
  Easing,
  Dimensions,
} from 'react-native';

const { width, height } = Dimensions.get('window');

interface AnimatedBloodLoaderProps {
  visible: boolean;
  onFinish?: () => void;
}

export default function AnimatedBloodLoader({ visible }: AnimatedBloodLoaderProps) {
  const flyX = useRef(new Animated.Value(-300)).current;
  const flyY = useRef(new Animated.Value(height + 200)).current;

  useEffect(() => {
    if (visible) {
      flyX.setValue(-600);
      flyY.setValue(height + 200);

      const animation = Animated.loop(
        Animated.parallel([
          Animated.timing(flyX, {
            toValue: width + 300,
            duration: 1500,
            easing: Easing.linear,
            useNativeDriver: true,
          }),
          Animated.timing(flyY, {
            toValue: -600,
            duration: 1000,
            easing: Easing.linear,
            useNativeDriver: true,
          }),
        ])
      );

      animation.start();

      return () => {
        animation.stop();
      };
    }
  }, [visible]);

  if (!visible) return null;

  return (
    <View style={styles.overlay}>
      <Animated.Image
        source={require('../assets/images/blood_superman.png')}
        style={[
          styles.image,
          {
            transform: [
              { translateX: flyX },
              { translateY: flyY },
            ],
          },
        ]}
        resizeMode="contain"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#FFFFFF',
    zIndex: 99999,
    elevation: 99999,
  },
  image: {
    width: 680,
    height: 680,
    position: 'absolute',
  },
});
