import React, { useEffect } from 'react';
import { View, Image, StatusBar } from 'react-native';
import * as ExpoSplashScreen from 'expo-splash-screen';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../types/navigation';

type SplashScreenProps = {
  navigation: StackNavigationProp<RootStackParamList, 'Splash'>;
};

const SplashScreen: React.FC<SplashScreenProps> = ({ navigation }) => {
  useEffect(() => {
    try {
      ExpoSplashScreen.hideAsync();
    } catch (e) {
      // Ignore if not on native environment
    }

    const timer = setTimeout(() => {
      navigation.replace('Welcome');
    }, 800);
    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <View style={{ flex: 1, backgroundColor: '#000000' }}>
      <StatusBar barStyle="light-content" backgroundColor="#000000" />
      <Image source={require('../assets/images/splash.png')} style={{ width: '100%', height: '100%' }} resizeMode="cover" />
    </View>
  );
};

export default SplashScreen;
