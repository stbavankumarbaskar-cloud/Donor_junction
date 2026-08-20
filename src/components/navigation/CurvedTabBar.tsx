import React, { useEffect } from 'react';
import { View, TouchableOpacity, Dimensions, StyleSheet } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/theme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { useLoading } from '../../contexts/LoadingContext';

const { width } = Dimensions.get('window');
const TAB_HEIGHT = 65;

const getPath = (bottomInset: number) => {
  const totalHeight = TAB_HEIGHT + bottomInset;
  const center = width / 2;
  return `
    M ${-width} 0
    L ${center - 45} 0
    C ${center - 25} 0, ${center - 25} 45, ${center} 45
    C ${center + 25} 45, ${center + 25} 0, ${center + 45} 0
    L ${width * 3} 0
    L ${width * 3} ${totalHeight}
    L ${-width} ${totalHeight}
    Z
  `;
};

const CurvedTabBar: React.FC<BottomTabBarProps> = ({ state, descriptors, navigation }) => {
  const insets = useSafeAreaInsets();
  const bottomInset = Math.max(insets?.bottom || 0, 15);

  const { showLoadingLocked } = useLoading();
  const translateX = useSharedValue(0);

  if (!state || !state.routes || state.routes.length === 0) {
    return null;
  }

  const tabWidth = width / state.routes.length;
  const currentIndex = typeof state.index === 'number' ? state.index : 0;

  useEffect(() => {
    const targetX = (currentIndex + 0.5) * tabWidth - (width / 2);
    translateX.value = withTiming(targetX, { duration: 250 });
  }, [currentIndex, tabWidth]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: translateX.value }]
    };
  });

  const activeRoute = state.routes[currentIndex] || state.routes[0];
  const activeRouteName = activeRoute ? activeRoute.name : 'Home';

  let activeIconName: keyof typeof Ionicons.glyphMap = 'home-outline';
  if (activeRouteName === 'Home') activeIconName = 'home-outline';
  else if (activeRouteName === 'Map') activeIconName = 'location-outline';
  else if (activeRouteName === 'Blog') activeIconName = 'document-text-outline';
  else if (activeRouteName === 'Chat') activeIconName = 'chatbubble-outline';
  else if (activeRouteName === 'Settings') activeIconName = 'person-outline';

  return (
    <View style={styles.container}>
      {/* Animated SVG Background */}
      <Animated.View style={[StyleSheet.absoluteFillObject, animatedStyle]}>
        <Svg
          width={width * 3}
          height={TAB_HEIGHT + bottomInset}
          viewBox={`${-width} 0 ${width * 3} ${TAB_HEIGHT + bottomInset}`}
          style={{ position: 'absolute', left: -width }}
        >
          <Path d={getPath(bottomInset)} fill="none" stroke="rgba(0,0,0,0.1)" strokeWidth="6" />
          <Path d={getPath(bottomInset)} fill="#FFFFFF" />
        </Svg>
      </Animated.View>

      {/* Floating Active Circle */}
      <Animated.View
        pointerEvents="none"
        style={[styles.activeCircleWrapper, { bottom: bottomInset + 20 }, animatedStyle]}
      >
        <View style={styles.activeCircle}>
          <Ionicons name={activeIconName} size={28} color="#FFFFFF" />
        </View>
      </Animated.View>

      {/* Tabs */}
      <View style={[styles.tabContainer, { paddingBottom: bottomInset, height: TAB_HEIGHT + bottomInset }]}>
        {state.routes.map((route, index) => {
          const isFocused = currentIndex === index;

          let iconName = 'home';
          if (route.name === 'Home') iconName = 'home';
          else if (route.name === 'Map') iconName = 'location';
          else if (route.name === 'Blog') iconName = 'document-text';
          else if (route.name === 'Chat') iconName = 'chatbubble';
          else if (route.name === 'Settings') iconName = 'person';

          const onPress = () => {
            const event = navigation.emit({ type: 'tabPress', target: route.key, canPreventDefault: true });
            if (!isFocused && !event.defaultPrevented) {
              if (showLoadingLocked) {
                showLoadingLocked(2000);
              }
              setTimeout(() => {
                navigation.navigate(route.name);
              }, 1800);
            }
          };

          return (
            <TouchableOpacity key={route.key || index} activeOpacity={0.8} onPress={onPress} style={styles.tab}>
              <View style={{ opacity: isFocused ? 0 : 1 }}>
                <Ionicons name={`${iconName}-outline` as keyof typeof Ionicons.glyphMap} size={24} color={COLORS.GRAY} />
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    width: width,
    backgroundColor: 'transparent',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 10,
  },
  activeCircleWrapper: {
    position: 'absolute',
    width: width,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
  },
  activeCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: COLORS.PRIMARY,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabContainer: {
    flexDirection: 'row',
    width: width,
    zIndex: 1,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  }
});

export default CurvedTabBar;
