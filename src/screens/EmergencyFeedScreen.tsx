import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { AlertCircle, Plus, CheckCircle, ShieldAlert } from 'lucide-react-native';
import { Colors } from '../theme/colors';
import { Header } from '../components/Header';
import { EmergencyCard } from '../components/EmergencyCard';
import { CreateRequestModal } from '../components/CreateRequestModal';
import { useDonorContext } from '../context/DonorContext';

type Tab = 'ALL' | 'CRITICAL' | 'FULFILLED';

export const EmergencyFeedScreen: React.FC = () => {
  const { emergencies } = useDonorContext();
  const [activeTab, setActiveTab] = useState<Tab>('ALL');
  const [modalVisible, setModalVisible] = useState(false);

  const filtered = emergencies.filter((item) => {
    if (activeTab === 'CRITICAL') return item.urgencyLevel === 'CRITICAL' && !item.fulfilled;
    if (activeTab === 'FULFILLED') return item.fulfilled;
    return true;
  });

  return (
    <View style={styles.container}>
      <Header subtitle="Live Emergency Blood Broadcasts" />

      {/* EMERGENCY DISCLAIMER */}
      <View style={styles.disclaimerBanner}>
        <ShieldAlert size={18} color={Colors.primary} />
        <Text style={styles.disclaimerText}>
          Broadcasted emergencies alert verified donors in your vicinity immediately.
        </Text>
      </View>

      {/* FILTER TABS */}
      <View style={styles.tabRow}>
        {(['ALL', 'CRITICAL', 'FULFILLED'] as const).map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[styles.tabBtn, activeTab === tab && styles.tabBtnActive]}
            onPress={() => setActiveTab(tab)}
          >
            <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        {filtered.length > 0 ? (
          filtered.map((item) => <EmergencyCard key={item.id} item={item} />)
        ) : (
          <View style={styles.emptyState}>
            <CheckCircle size={36} color={Colors.secondary} />
            <Text style={styles.emptyTitle}>No Emergency Requests Found</Text>
            <Text style={styles.emptySub}>No active emergencies matching this tab.</Text>
          </View>
        )}
        <View style={{ height: 90 }} />
      </ScrollView>

      {/* FLOATING ACTION BUTTON */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => setModalVisible(true)}
        activeOpacity={0.85}
      >
        <Plus size={22} color={Colors.white} />
        <Text style={styles.fabText}>New Request</Text>
      </TouchableOpacity>

      <CreateRequestModal visible={modalVisible} onClose={() => setModalVisible(false)} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  disclaimerBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: Colors.dangerBg,
    marginHorizontal: 16,
    marginTop: 12,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(229, 57, 53, 0.3)',
  },
  disclaimerText: {
    flex: 1,
    fontSize: 12,
    color: Colors.textPrimary,
    fontWeight: '600',
  },
  tabRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginTop: 12,
    marginBottom: 8,
    gap: 8,
  },
  tabBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: Colors.cardBg,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.cardBorder,
  },
  tabBtnActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  tabText: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.textSecondary,
  },
  tabTextActive: {
    color: Colors.white,
  },
  scroll: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  emptyState: {
    backgroundColor: Colors.cardBg,
    borderRadius: 16,
    padding: 30,
    alignItems: 'center',
    marginTop: 20,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: Colors.textPrimary,
    marginTop: 12,
  },
  emptySub: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 4,
  },
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: Colors.primary,
    paddingHorizontal: 18,
    paddingVertical: 14,
    borderRadius: 30,
    elevation: 8,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
  },
  fabText: {
    color: Colors.white,
    fontWeight: '800',
    fontSize: 14,
  },
});
