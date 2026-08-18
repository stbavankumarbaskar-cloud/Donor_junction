import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Heart, Bell } from 'lucide-react-native';
import { Colors } from '../theme/colors';
import { useDonorContext } from '../context/DonorContext';

export const Header: React.FC<{ subtitle?: string }> = ({ subtitle = 'Life-Saving Donor Network' }) => {
  const { user, showToast } = useDonorContext();

  return (
    <View style={styles.headerContainer}>
      <View style={styles.leftRow}>
        <View style={styles.logoBadge}>
          <Heart color={Colors.primary} size={24} fill={Colors.primary} />
        </View>
        <View>
          <Text style={styles.title}>Donor Junction</Text>
          <Text style={styles.subtitle}>{subtitle}</Text>
        </View>
      </View>

      <TouchableOpacity
        style={styles.bellButton}
        onPress={() => showToast('🔔 2 active emergency alerts in your city')}
      >
        <Bell color={Colors.textPrimary} size={20} />
        <View style={styles.activeDot} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 16,
    backgroundColor: Colors.background,
    borderBottomWidth: 1,
    borderBottomColor: Colors.cardBorder,
  },
  leftRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  logoBadge: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: Colors.dangerBg,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(229, 57, 53, 0.4)',
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    color: Colors.textPrimary,
    letterSpacing: 0.3,
  },
  subtitle: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  bellButton: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: Colors.cardBg,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    position: 'relative',
  },
  activeDot: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.primary,
  },
});
