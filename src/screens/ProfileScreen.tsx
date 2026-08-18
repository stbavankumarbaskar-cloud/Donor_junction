import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Switch,
} from 'react-native';
import {
  User,
  Heart,
  Award,
  Calendar,
  ShieldCheck,
  CheckCircle2,
  Droplet,
  Info,
} from 'lucide-react-native';
import { Colors } from '../theme/colors';
import { Header } from '../components/Header';
import { useDonorContext } from '../context/DonorContext';
import { COMPATIBILITY_CHART } from '../mock/data';

export const ProfileScreen: React.FC = () => {
  const { user, toggleUserAvailability, showToast } = useDonorContext();
  const [showChart, setShowChart] = useState(false);

  const recipientGroups = COMPATIBILITY_CHART[user.bloodGroup] || [];

  return (
    <View style={styles.container}>
      <Header subtitle="Your Donor Profile & Impact" />

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* USER PROFILE CARD */}
        <View style={styles.profileCard}>
          <View style={styles.avatarRow}>
            <View style={styles.avatarCircle}>
              <Text style={styles.bloodText}>{user.bloodGroup}</Text>
            </View>

            <View style={styles.nameCol}>
              <View style={styles.verifiedRow}>
                <Text style={styles.userName}>{user.name}</Text>
                <ShieldCheck size={18} color={Colors.secondary} />
              </View>
              <Text style={styles.userPhone}>{user.phone}</Text>
              <Text style={styles.userCity}>📍 {user.city}</Text>
            </View>
          </View>

          {/* AVAILABILITY TOGGLE */}
          <View style={styles.toggleRow}>
            <View>
              <Text style={styles.toggleTitle}>Donor Availability Status</Text>
              <Text style={styles.toggleSub}>
                {user.isAvailable
                  ? 'Visible on map to emergency requesters'
                  : 'Hidden from active donor searches'}
              </Text>
            </View>
            <Switch
              value={user.isAvailable}
              onValueChange={toggleUserAvailability}
              trackColor={{ false: Colors.cardBorder, true: Colors.secondary }}
              thumbColor={Colors.white}
            />
          </View>
        </View>

        {/* IMPACT SUMMARY */}
        <View style={styles.impactContainer}>
          <Text style={styles.sectionTitle}>Your Heroic Impact</Text>
          <View style={styles.impactGrid}>
            <View style={styles.impactCard}>
              <Heart size={24} color={Colors.primary} fill={Colors.primary} />
              <Text style={styles.impactVal}>{user.livesSaved}</Text>
              <Text style={styles.impactLbl}>Lives Saved</Text>
            </View>

            <View style={styles.impactCard}>
              <Droplet size={24} color={Colors.secondary} />
              <Text style={styles.impactVal}>{user.totalDonations}</Text>
              <Text style={styles.impactLbl}>Total Donations</Text>
            </View>

            <View style={styles.impactCard}>
              <Calendar size={24} color={Colors.accent} />
              <Text style={styles.impactVal}>Ready</Text>
              <Text style={styles.impactLbl}>Eligible Now</Text>
            </View>
          </View>
        </View>

        {/* COMPATIBILITY INFO */}
        <View style={styles.infoCard}>
          <View style={styles.infoHead}>
            <Info size={18} color={Colors.primary} />
            <Text style={styles.infoHeadText}>Blood Compatibility Matrix</Text>
          </View>

          <Text style={styles.infoBodyText}>
            As an <Text style={{ fontWeight: '800', color: Colors.primary }}>{user.bloodGroup}</Text> donor, you can safely donate blood to:
          </Text>

          <View style={styles.chipGrid}>
            {recipientGroups.map((bg) => (
              <View key={bg} style={styles.compatChip}>
                <Text style={styles.compatChipText}>{bg}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* ACHIEVEMENT BADGES */}
        <View style={styles.badgeSection}>
          <Text style={styles.sectionTitle}>Earned Badges</Text>
          <View style={styles.badgeRow}>
            <View style={styles.badgeItem}>
              <View style={[styles.badgeIcon, { backgroundColor: Colors.dangerBg }]}>
                <Award size={20} color={Colors.primary} />
              </View>
              <Text style={styles.badgeTitle}>Life Saver</Text>
              <Text style={styles.badgeSub}>5+ Donations</Text>
            </View>

            <View style={styles.badgeItem}>
              <View style={[styles.badgeIcon, { backgroundColor: Colors.successBg }]}>
                <CheckCircle2 size={20} color={Colors.secondary} />
              </View>
              <Text style={styles.badgeTitle}>Verified Hero</Text>
              <Text style={styles.badgeSub}>Identity Checked</Text>
            </View>

            <View style={styles.badgeItem}>
              <View style={[styles.badgeIcon, { backgroundColor: Colors.warningBg }]}>
                <Heart size={20} color={Colors.accent} />
              </View>
              <Text style={styles.badgeTitle}>Golden Donor</Text>
              <Text style={styles.badgeSub}>Active 2026</Text>
            </View>
          </View>
        </View>

        {/* DONATION HISTORY */}
        <View style={styles.historySection}>
          <Text style={styles.sectionTitle}>Recent Donation Records</Text>

          {[
            { id: '1', date: 'May 10, 2026', location: 'Mount Sinai Hospital', units: 1 },
            { id: '2', date: 'Feb 14, 2026', location: 'Metropolitan Blood Center', units: 1 },
            { id: '3', date: 'Nov 05, 2025', location: 'Red Cross Community Drive', units: 1 },
          ].map((item) => (
            <View key={item.id} style={styles.historyRow}>
              <View style={styles.historyLeft}>
                <Droplet size={16} color={Colors.primary} />
                <View>
                  <Text style={styles.historyLoc}>{item.location}</Text>
                  <Text style={styles.historyDate}>{item.date}</Text>
                </View>
              </View>
              <Text style={styles.historyUnits}>{item.units} Unit</Text>
            </View>
          ))}
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scroll: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  profileCard: {
    backgroundColor: Colors.cardBg,
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
  },
  avatarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  avatarCircle: {
    width: 64,
    height: 64,
    borderRadius: 20,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bloodText: {
    fontSize: 24,
    fontWeight: '900',
    color: Colors.white,
  },
  nameCol: {
    flex: 1,
  },
  verifiedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  userName: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  userPhone: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  userCity: {
    fontSize: 12,
    color: Colors.textMuted,
    marginTop: 2,
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 16,
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: Colors.cardBorder,
  },
  toggleTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  toggleSub: {
    fontSize: 11,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  impactContainer: {
    marginTop: 18,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: Colors.textPrimary,
    marginBottom: 10,
  },
  impactGrid: {
    flexDirection: 'row',
    gap: 10,
  },
  impactCard: {
    flex: 1,
    backgroundColor: Colors.cardBg,
    borderRadius: 14,
    padding: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.cardBorder,
  },
  impactVal: {
    fontSize: 18,
    fontWeight: '900',
    color: Colors.textPrimary,
    marginTop: 6,
  },
  impactLbl: {
    fontSize: 11,
    color: Colors.textMuted,
    marginTop: 2,
  },
  infoCard: {
    backgroundColor: Colors.cardBg,
    borderRadius: 16,
    padding: 16,
    marginTop: 16,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
  },
  infoHead: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  infoHeadText: {
    fontSize: 14,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  infoBodyText: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginBottom: 10,
  },
  chipGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  compatChip: {
    backgroundColor: Colors.dangerBg,
    borderWidth: 1,
    borderColor: Colors.primary,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  compatChipText: {
    color: Colors.primary,
    fontSize: 12,
    fontWeight: '800',
  },
  badgeSection: {
    marginTop: 18,
  },
  badgeRow: {
    flexDirection: 'row',
    gap: 10,
  },
  badgeItem: {
    flex: 1,
    backgroundColor: Colors.cardBg,
    borderRadius: 14,
    padding: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.cardBorder,
  },
  badgeIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  badgeTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  badgeSub: {
    fontSize: 10,
    color: Colors.textMuted,
    marginTop: 2,
  },
  historySection: {
    marginTop: 18,
  },
  historyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.cardBg,
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
  },
  historyLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  historyLoc: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  historyDate: {
    fontSize: 11,
    color: Colors.textMuted,
    marginTop: 1,
  },
  historyUnits: {
    fontSize: 12,
    fontWeight: '800',
    color: Colors.secondary,
  },
});
