import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { AlertCircle, Clock, MapPin, CheckCircle2, HeartHandshake } from 'lucide-react-native';
import { Colors } from '../theme/colors';
import { EmergencyRequest } from '../types';
import { useDonorContext } from '../context/DonorContext';

export const EmergencyCard: React.FC<{ item: EmergencyRequest }> = ({ item }) => {
  const { respondToEmergency } = useDonorContext();

  const isCritical = item.urgencyLevel === 'CRITICAL';

  return (
    <View style={[styles.card, isCritical ? styles.cardCritical : styles.cardModerate]}>
      <View style={styles.topBanner}>
        <View style={styles.badgeRow}>
          <AlertCircle size={16} color={isCritical ? Colors.primary : Colors.accent} />
          <Text style={[styles.urgencyText, { color: isCritical ? Colors.primary : Colors.accent }]}>
            {item.urgencyLevel} EMERGENCY
          </Text>
        </View>

        <View style={styles.timeRow}>
          <Clock size={12} color={Colors.textMuted} />
          <Text style={styles.timeText}>{item.createdAt}</Text>
        </View>
      </View>

      <View style={styles.bodyRow}>
        <View style={styles.bloodCircle}>
          <Text style={styles.bloodGroupText}>{item.bloodGroup}</Text>
          <Text style={styles.unitsText}>{item.unitsNeeded} {item.unitsNeeded > 1 ? 'Units' : 'Unit'}</Text>
        </View>

        <View style={styles.detailsCol}>
          <Text style={styles.patientName}>{item.patientName}</Text>
          <Text style={styles.requestedBy}>Req by: {item.requestedBy}</Text>

          <View style={styles.locationRow}>
            <MapPin size={12} color={Colors.textSecondary} />
            <Text style={styles.hospitalText} numberOfLines={2}>
              {item.hospitalName}
            </Text>
          </View>
        </View>
      </View>

      {item.notes && (
        <View style={styles.notesBox}>
          <Text style={styles.notesText} numberOfLines={2}>
            "{item.notes}"
          </Text>
        </View>
      )}

      <TouchableOpacity
        style={[styles.respondButton, item.fulfilled && styles.fulfilledButton]}
        disabled={item.fulfilled}
        onPress={() => respondToEmergency(item.id)}
        activeOpacity={0.8}
      >
        {item.fulfilled ? (
          <>
            <CheckCircle2 size={16} color={Colors.secondary} />
            <Text style={[styles.respondText, { color: Colors.secondary }]}>Response Registered</Text>
          </>
        ) : (
          <>
            <HeartHandshake size={16} color={Colors.white} />
            <Text style={styles.respondText}>Respond & Help Patient</Text>
          </>
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.cardBg,
    borderRadius: 16,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1.5,
  },
  cardCritical: {
    borderColor: Colors.primary,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
  },
  cardModerate: {
    borderColor: Colors.accent,
  },
  topBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  urgencyText: {
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  timeText: {
    fontSize: 11,
    color: Colors.textMuted,
  },
  bodyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  bloodCircle: {
    width: 64,
    height: 64,
    borderRadius: 16,
    backgroundColor: Colors.dangerBg,
    borderWidth: 1.5,
    borderColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bloodGroupText: {
    fontSize: 20,
    fontWeight: '900',
    color: Colors.primary,
  },
  unitsText: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.textSecondary,
    marginTop: 1,
  },
  detailsCol: {
    flex: 1,
  },
  patientName: {
    fontSize: 17,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  requestedBy: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 6,
  },
  hospitalText: {
    fontSize: 12,
    color: Colors.textSecondary,
    flexShrink: 1,
  },
  notesBox: {
    marginTop: 12,
    padding: 10,
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
    borderRadius: 8,
    borderLeftWidth: 3,
    borderLeftColor: Colors.primary,
  },
  notesText: {
    fontSize: 12,
    fontStyle: 'italic',
    color: Colors.textSecondary,
  },
  respondButton: {
    marginTop: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: Colors.primary,
    paddingVertical: 12,
    borderRadius: 10,
  },
  fulfilledButton: {
    backgroundColor: Colors.successBg,
    borderWidth: 1,
    borderColor: Colors.secondary,
  },
  respondText: {
    fontSize: 14,
    fontWeight: '800',
    color: Colors.white,
  },
});
