import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Heart, Search, AlertCircle, User } from 'lucide-react-native';
import { Colors } from '../theme/colors';
import HomeScreen from '../screens/HomeScreen';
import { DonorSearchScreen } from '../screens/DonorSearchScreen';
import { EmergencyFeedScreen } from '../screens/EmergencyFeedScreen';
import { ProfileScreen } from '../screens/ProfileScreen';

const Tab = createBottomTabNavigator();

export const TabNavigator: React.FC = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: Colors.cardBg,
          borderTopColor: Colors.cardBorder,
          height: 64,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.textMuted,
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '700',
        },
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen as any}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({ color, size }) => <Heart color={color} size={size} fill={color === Colors.primary ? Colors.primary : 'transparent'} />,
        }}
      />
      <Tab.Screen
        name="Donors"
        component={DonorSearchScreen}
        options={{
          tabBarLabel: 'Find Donors',
          tabBarIcon: ({ color, size }) => <Search color={color} size={size} />,
        }}
      />
      <Tab.Screen
        name="Emergencies"
        component={EmergencyFeedScreen}
        options={{
          tabBarLabel: 'Emergencies',
          tabBarIcon: ({ color, size }) => <AlertCircle color={color} size={size} />,
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarLabel: 'Profile',
          tabBarIcon: ({ color, size }) => <User color={color} size={size} />,
        }}
      />
    </Tab.Navigator>
  );
};
