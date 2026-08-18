import React, { ReactNode } from 'react';
import { View, Text, TouchableOpacity, ViewStyle } from 'react-native';
import { styles } from '../../styles/globalStyles';

interface BadgeProps {
  children: ReactNode;
  color?: string;
  textColor?: string;
}

export const Badge: React.FC<BadgeProps> = ({ children, color = '#ffeaea', textColor = '#A32D2D' }) => (
  <View style={[styles.badge, { backgroundColor: color }]}>
    <Text style={[styles.badgeText, { color: textColor }]}>{children}</Text>
  </View>
);

interface CardProps {
  children: ReactNode;
  style?: ViewStyle;
  onPress?: () => void;
}

export const Card: React.FC<CardProps> = ({ children, style, onPress }) => (
  <TouchableOpacity
    style={[styles.card, style]}
    onPress={onPress}
    activeOpacity={onPress ? 0.7 : 1}
  >
    {children}
  </TouchableOpacity>
);
