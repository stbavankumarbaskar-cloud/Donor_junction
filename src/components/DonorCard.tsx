import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Linking } from 'react-native';
import { Phone, MessageSquare, MapPin, CheckCircle, ShieldCheck } from 'lucide-react-native';
import { Colors } from '../theme/colors';
import { Donor } from '../types';
import { useDonorContext } from '../context/DonorContext';

export const DonorCard: React.FC<{ donor: Donor }> = ({ donor }) => {
  const { showToast } = useDonorContext();

  const handleCall = () => {
    showToast(`Calling ${donor.name} (${donor.phone})...`);
  };

  const handleMessage = () => {
    showToast(`Opening messaging for ${donor.name}...`);
  };

  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.bloodBadge}>
          <Text style={styles.bloodText}>{donor.bloodGroup}</Text>
        </View>

        <View style={styles.infoCol}>
          <View style={styles.nameRow}>
            <Text style={styles.name}>{donor.name}</Text>
            {donor.verified && <ShieldCheck size={16} color={Colors.secondary} />}
          </View>

          <View style={styles.locationRow}>
            <MapPin size={12} color={Colors.textSecondary} />
            <Text style={styles.locationText} numberOfLines={1}>
              {donor.location} ({donor.distanceKm} km away)
            </Text>
          </View>
        </View>

        <View
          style={[
            styles.statusPill,
            donor.isAvailable ? styles.statusAvailable : styles.statusBusy,
          ]}
        >
          <Text
            style={[
              styles.statusText,
              donor.isAvailable ? styles.statusAvailableText : styles.statusBusyText,
            ]}
          >
            {donor.isAvailable ? 'Available' : 'Busy'}
          </Text>
        </View>
      </View>

      <View style={styles.divider} />

      <View style={styles.cardFooter}>
        <View style={styles.statsCol}>
          <Text style={styles.statLabel}>Donations</Text>
          <Text style={styles.statValue}>{donor.totalDonations} times</Text>
        </View>

        <View style={styles.actionRow}>
          <TouchableOpacity
            style={[styles.actionBtn, styles.callBtn]}
            onPress={handleCall}
            activeOpacity={0.8}
          >
            <Phone size={14} color={Colors.white} />
            <Text style={styles.actionBtnText}>Call</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionBtn, styles.chatBtn]}
            onPress={handleMessage}
            activeOpacity={0.8}
          >
            <MessageSquare size={14} color={Colors.textPrimary} />
            <Text style={[styles.actionBtnText, { color: Colors.textPrimary }]}>Chat</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.cardBg,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  bloodBadge: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bloodText: {
    fontSize: 18,
    fontWeight: '900',
    color: Colors.white,
  },
  infoCol: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  name: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 2,
  },
  locationText: {
    fontSize: 12,
    color: Colors.textSecondary,
    maxWidth: 160,
  },
  statusPill: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusAvailable: {
    backgroundColor: Colors.successBg,
    borderColor: Colors.secondary,
    borderWidth: 1,
  },
  statusBusy: {
    backgroundColor: 'rgba(148, 163, 184, 0.1)',
    borderColor: Colors.cardBorder,
    borderWidth: 1,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '700',
  },
  statusAvailableText: {
    color: Colors.secondary,
  },
  statusBusyText: {
    color: Colors.textMuted,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.cardBorder,
    marginVertical: 12,
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  statsCol: {
    gap: 2,
  },
  statLabel: {
    fontSize: 11,
    color: Colors.textMuted,
  },
  statValue: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  actionRow: {
    flexDirection: 'row',
    gap: 8,
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
  },
  callBtn: {
    backgroundColor: Colors.primary,
  },
  chatBtn: {
    backgroundColor: Colors.cardBorder,
  },
  actionBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.white,
  },
});
