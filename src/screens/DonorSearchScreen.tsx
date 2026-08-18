import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { Search, Filter, ShieldCheck, Check } from 'lucide-react-native';
import { Colors } from '../theme/colors';
import { Header } from '../components/Header';
import { DonorCard } from '../components/DonorCard';
import { BloodGroupFilter } from '../components/BloodGroupFilter';
import { useDonorContext } from '../context/DonorContext';

export const DonorSearchScreen: React.FC = () => {
  const { donors, selectedBloodGroup, searchQuery, setSearchQuery } = useDonorContext();
  const [onlyAvailable, setOnlyAvailable] = useState(false);
  const [onlyVerified, setOnlyVerified] = useState(false);

  const filtered = donors.filter((d) => {
    // Blood group filter
    if (selectedBloodGroup !== 'ALL' && d.bloodGroup !== selectedBloodGroup) {
      return false;
    }
    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = d.name.toLowerCase().includes(q);
      const matchLoc = (d.location || '').toLowerCase().includes(q);
      const matchCity = (d.city || '').toLowerCase().includes(q);
      if (!matchName && !matchLoc && !matchCity) return false;
    }
    // Availability filter
    if (onlyAvailable && !d.isAvailable) return false;
    // Verified filter
    if (onlyVerified && !d.verified) return false;

    return true;
  });

  return (
    <View style={styles.container}>
      <Header subtitle="Find Verified Donors Nearby" />

      <View style={styles.content}>
        {/* SEARCH INPUT */}
        <View style={styles.searchBarContainer}>
          <Search size={18} color={Colors.textSecondary} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search by name, location, or city..."
            placeholderTextColor={Colors.textMuted}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Text style={styles.clearText}>Clear</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* BLOOD GROUP FILTER */}
        <BloodGroupFilter />

        {/* TOGGLE FILTERS ROW */}
        <View style={styles.filterRow}>
          <TouchableOpacity
            style={[styles.filterChip, onlyAvailable && styles.filterChipActive]}
            onPress={() => setOnlyAvailable(!onlyAvailable)}
          >
            <View style={[styles.checkbox, onlyAvailable && styles.checkboxActive]}>
              {onlyAvailable && <Check size={10} color={Colors.white} />}
            </View>
            <Text style={[styles.filterChipText, onlyAvailable && styles.filterChipTextActive]}>
              Available Now
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.filterChip, onlyVerified && styles.filterChipActive]}
            onPress={() => setOnlyVerified(!onlyVerified)}
          >
            <View style={[styles.checkbox, onlyVerified && styles.checkboxActive]}>
              {onlyVerified && <Check size={10} color={Colors.white} />}
            </View>
            <Text style={[styles.filterChipText, onlyVerified && styles.filterChipTextActive]}>
              Verified Donors
            </Text>
          </TouchableOpacity>
        </View>

        {/* DONOR RESULTS FEED */}
        <ScrollView style={styles.donorList} showsVerticalScrollIndicator={false}>
          <Text style={styles.resultsCount}>
            Found <Text style={{ color: Colors.primary, fontWeight: '800' }}>{filtered.length}</Text> matching donors
          </Text>

          {filtered.length > 0 ? (
            filtered.map((donor) => <DonorCard key={donor.id} donor={donor} />)
          ) : (
            <View style={styles.noResultsBox}>
              <Text style={styles.noResultsTitle}>No donors matched your filters</Text>
              <Text style={styles.noResultsSub}>Try resetting the blood group or location search query.</Text>
            </View>
          )}

          <View style={{ height: 40 }} />
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    flex: 1,
    paddingTop: 12,
  },
  searchBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.cardBg,
    marginHorizontal: 16,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    gap: 10,
  },
  searchInput: {
    flex: 1,
    color: Colors.textPrimary,
    fontSize: 14,
  },
  clearText: {
    color: Colors.textMuted,
    fontSize: 12,
    fontWeight: '600',
  },
  filterRow: {
    flexDirection: 'row',
    gap: 10,
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: Colors.cardBg,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
  },
  filterChipActive: {
    borderColor: Colors.primary,
    backgroundColor: Colors.dangerBg,
  },
  checkbox: {
    width: 14,
    height: 14,
    borderRadius: 3,
    borderWidth: 1,
    borderColor: Colors.textMuted,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  filterChipText: {
    fontSize: 12,
    color: Colors.textSecondary,
    fontWeight: '600',
  },
  filterChipTextActive: {
    color: Colors.textPrimary,
  },
  donorList: {
    flex: 1,
    paddingHorizontal: 16,
  },
  resultsCount: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginBottom: 10,
  },
  noResultsBox: {
    padding: 24,
    backgroundColor: Colors.cardBg,
    borderRadius: 16,
    alignItems: 'center',
    marginTop: 20,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
  },
  noResultsTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  noResultsSub: {
    fontSize: 12,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
});
