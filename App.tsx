import React, { useState, useRef } from 'react';
import { View } from 'react-native';
import { NavigationContainer, NavigationContainerRef } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Ionicons } from '@expo/vector-icons';
import AppNavigator from './src/navigation/AppNavigator';
import { LoadingProvider } from './src/contexts/LoadingContext';
import { GlobalLoader } from './src/components/common/GlobalLoader';
import GlobalVideoLoader from './src/components/GlobalVideoLoader';
import { RootStackParamList } from './src/types/navigation';

function AppContent() {
  const [isNavigating, setIsNavigating] = useState(false);
  const routeNameRef = useRef<string | undefined>(undefined);
  const navigationRef = useRef<NavigationContainerRef<RootStackParamList>>(null);

  return (
    <View style={{ flex: 1 }}>
      <NavigationContainer
        ref={navigationRef}
        onReady={() => {
          routeNameRef.current = navigationRef.current?.getCurrentRoute()?.name;
        }}
        onStateChange={async () => {
          const previousRouteName = routeNameRef.current;
          const currentRouteName = navigationRef.current?.getCurrentRoute()?.name;

          if (previousRouteName !== currentRouteName) {
            setIsNavigating(true);
            setTimeout(() => {
              setIsNavigating(false);
            }, 600);
          }
          routeNameRef.current = currentRouteName;
        }}
      >
        <AppNavigator />
      </NavigationContainer>
      <GlobalLoader />
      {isNavigating && <GlobalVideoLoader />}
    </View>
  );
}

export default function App() {
  const [fontsLoaded] = useFonts({
    ...Ionicons.font,
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
    <LoadingProvider>
      <AppContent />
    </LoadingProvider>
  );
}
