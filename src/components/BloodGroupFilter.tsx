import React from 'react';
import { StyleSheet, Text, ScrollView, TouchableOpacity, View } from 'react-native';
import { Colors } from '../theme/colors';
import { BloodGroup } from '../types';
import { useDonorContext } from '../context/DonorContext';

const BLOOD_GROUPS: (BloodGroup | 'ALL')[] = [
  'ALL',
  'A+',
  'A-',
  'B+',
  'B-',
  'O+',
  'O-',
  'AB+',
  'AB-',
];

export const BloodGroupFilter: React.FC = () => {
  const { selectedBloodGroup, setSelectedBloodGroup } = useDonorContext();

  return (
    <View style={styles.container}>
      <Text style={styles.sectionLabel}>Blood Group Filter</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {BLOOD_GROUPS.map((bg) => {
          const isSelected = selectedBloodGroup === bg;
          return (
            <TouchableOpacity
              key={bg}
              style={[
                styles.chip,
                isSelected && styles.chipSelected,
              ]}
              onPress={() => setSelectedBloodGroup(bg)}
              activeOpacity={0.7}
            >
              <Text style={[styles.chipText, isSelected && styles.chipTextSelected]}>
                {bg === 'ALL' ? '🩸 All' : bg}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 12,
  },
  sectionLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.textSecondary,
    marginBottom: 8,
    paddingHorizontal: 20,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  scrollContent: {
    paddingHorizontal: 20,
    gap: 8,
  },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: Colors.cardBg,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
  },
  chipSelected: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  chipText: {
    color: Colors.textSecondary,
    fontSize: 14,
    fontWeight: '700',
  },
  chipTextSelected: {
    color: Colors.white,
  },
});
