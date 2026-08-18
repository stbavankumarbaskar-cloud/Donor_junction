import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Modal,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { X, PlusCircle } from 'lucide-react-native';
import { Colors } from '../theme/colors';
import { BloodGroup } from '../types';
import { useDonorContext } from '../context/DonorContext';

const BLOOD_GROUPS: BloodGroup[] = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'];

export const CreateRequestModal: React.FC<{
  visible: boolean;
  onClose: () => void;
}> = ({ visible, onClose }) => {
  const { addEmergencyRequest } = useDonorContext();

  const [patientName, setPatientName] = useState('');
  const [bloodGroup, setBloodGroup] = useState<BloodGroup>('O-');
  const [unitsNeeded, setUnitsNeeded] = useState('2');
  const [hospitalName, setHospitalName] = useState('');
  const [urgencyLevel, setUrgencyLevel] = useState<'CRITICAL' | 'MODERATE' | 'STANDARD'>('CRITICAL');
  const [contactPhone, setContactPhone] = useState('');
  const [notes, setNotes] = useState('');

  const handleSubmit = () => {
    if (!patientName.trim() || !hospitalName.trim() || !contactPhone.trim()) {
      alert('Please fill out all required fields (Patient, Hospital, Contact Phone).');
      return;
    }

    addEmergencyRequest({
      patientName: patientName.trim(),
      bloodGroup,
      unitsNeeded: parseInt(unitsNeeded) || 1,
      hospitalName: hospitalName.trim(),
      city: 'New York',
      urgencyLevel,
      contactPhone: contactPhone.trim(),
      requestedBy: 'You (Requester)',
      notes: notes.trim() || undefined,
    });

    // Reset and close
    setPatientName('');
    setHospitalName('');
    setContactPhone('');
    setNotes('');
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.overlay}
      >
        <View style={styles.container}>
          <View style={styles.modalHeader}>
            <View style={styles.headerTitleRow}>
              <PlusCircle size={22} color={Colors.primary} />
              <Text style={styles.modalTitle}>Post Emergency Request</Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <X size={20} color={Colors.textSecondary} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.formScroll} showsVerticalScrollIndicator={false}>
            <Text style={styles.label}>Patient Name *</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. David Miller"
              placeholderTextColor={Colors.textMuted}
              value={patientName}
              onChangeText={setPatientName}
            />

            <Text style={styles.label}>Required Blood Group *</Text>
            <View style={styles.bloodGrid}>
              {BLOOD_GROUPS.map((bg) => (
                <TouchableOpacity
                  key={bg}
                  style={[
                    styles.bloodChip,
                    bloodGroup === bg && styles.bloodChipSelected,
                  ]}
                  onPress={() => setBloodGroup(bg)}
                >
                  <Text
                    style={[
                      styles.bloodChipText,
                      bloodGroup === bg && styles.bloodChipTextSelected,
                    ]}
                  >
                    {bg}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.rowTwo}>
              <View style={{ flex: 1 }}>
                <Text style={styles.label}>Units Needed *</Text>
                <TextInput
                  style={styles.input}
                  keyboardType="numeric"
                  placeholder="2"
                  placeholderTextColor={Colors.textMuted}
                  value={unitsNeeded}
                  onChangeText={setUnitsNeeded}
                />
              </View>

              <View style={{ flex: 1 }}>
                <Text style={styles.label}>Urgency Level</Text>
                <View style={styles.urgencyRow}>
                  {(['CRITICAL', 'MODERATE'] as const).map((level) => (
                    <TouchableOpacity
                      key={level}
                      style={[
                        styles.urgencyChip,
                        urgencyLevel === level && styles.urgencyChipSelected,
                      ]}
                      onPress={() => setUrgencyLevel(level)}
                    >
                      <Text
                        style={[
                          styles.urgencyChipText,
                          urgencyLevel === level && styles.urgencyChipTextSelected,
                        ]}
                      >
                        {level}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </View>

            <Text style={styles.label}>Hospital / Medical Center *</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. City General Hospital Room 302"
              placeholderTextColor={Colors.textMuted}
              value={hospitalName}
              onChangeText={setHospitalName}
            />

            <Text style={styles.label}>Contact Phone Number *</Text>
            <TextInput
              style={styles.input}
              keyboardType="phone-pad"
              placeholder="+1 (555) 000-0000"
              placeholderTextColor={Colors.textMuted}
              value={contactPhone}
              onChangeText={setContactPhone}
            />

            <Text style={styles.label}>Additional Notes / Surgery Info</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              multiline
              numberOfLines={3}
              placeholder="Provide relevant medical details..."
              placeholderTextColor={Colors.textMuted}
              value={notes}
              onChangeText={setNotes}
            />

            <TouchableOpacity
              style={styles.submitButton}
              onPress={handleSubmit}
              activeOpacity={0.85}
            >
              <Text style={styles.submitButtonText}>Broadcast Emergency Alert 🚨</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: Colors.overlay,
    justifyContent: 'flex-end',
  },
  container: {
    backgroundColor: Colors.cardBg,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '85%',
    padding: 20,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.cardBorder,
  },
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  closeBtn: {
    padding: 4,
  },
  formScroll: {
    marginTop: 14,
  },
  label: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.textSecondary,
    marginBottom: 6,
    marginTop: 10,
    textTransform: 'uppercase',
  },
  input: {
    backgroundColor: Colors.background,
    borderColor: Colors.cardBorder,
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 14,
    color: Colors.textPrimary,
  },
  textArea: {
    height: 70,
    textAlignVertical: 'top',
  },
  bloodGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  bloodChip: {
    width: '22%',
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: Colors.background,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    alignItems: 'center',
  },
  bloodChipSelected: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  bloodChipText: {
    color: Colors.textSecondary,
    fontWeight: '700',
    fontSize: 13,
  },
  bloodChipTextSelected: {
    color: Colors.white,
  },
  rowTwo: {
    flexDirection: 'row',
    gap: 12,
  },
  urgencyRow: {
    flexDirection: 'row',
    gap: 6,
  },
  urgencyChip: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: Colors.background,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    alignItems: 'center',
  },
  urgencyChipSelected: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  urgencyChipText: {
    fontSize: 11,
    fontWeight: '800',
    color: Colors.textMuted,
  },
  urgencyChipTextSelected: {
    color: Colors.white,
  },
  submitButton: {
    backgroundColor: Colors.primary,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 30,
  },
  submitButtonText: {
    color: Colors.white,
    fontSize: 15,
    fontWeight: '800',
  },
});
