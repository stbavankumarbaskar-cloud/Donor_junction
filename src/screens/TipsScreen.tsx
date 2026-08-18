import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StatusBar, Image, Modal, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { nutritionTips } from '../data/nutritionTipsData';
import { NutritionTip } from '../types';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../types/navigation';

type TipsScreenProps = {
  navigation: StackNavigationProp<RootStackParamList, 'Tips'>;
};

const TipsScreen: React.FC<TipsScreenProps> = ({ navigation }) => {
  const [selectedItem, setSelectedItem] = useState<NutritionTip | null>(null);

  return (
    <SafeAreaView style={[tipStyles.container, { flex: 1, backgroundColor: '#DA0037' }]} edges={['top', 'right', 'bottom', 'left']}>
      <StatusBar barStyle="light-content" backgroundColor="#fcfcfcff" />
      <View style={{ flex: 1, backgroundColor: '#FFF9FA' }}>
        <View style={[tipStyles.header, { backgroundColor: '#fdfdfdff', borderBottomWidth: 0 }]}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={tipStyles.backBtn}>
            <Ionicons name="arrow-back" size={24} color="#DA0037" />
          </TouchableOpacity>
          <Text style={[tipStyles.headerTitle, { color: '#e92424ff' }]}>Health Tips</Text>
          <View style={{ width: 24 }} />
        </View>

        <View style={{ flex: 1, backgroundColor: '#faf7f7ff' }}>
          <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingVertical: 15 }}>
            {nutritionTips.map((item) => {
              const isRemoteUrl = typeof item.image === 'string' && (item.image.startsWith('http://') || item.image.startsWith('https://'));
              const imageSrc = isRemoteUrl ? { uri: item.image } : item.image;
              const isLocalAsset = !isRemoteUrl;
              return (
                <TouchableOpacity
                  key={item.id}
                  style={tipStyles.card}
                  onPress={() => setSelectedItem(item)}
                  activeOpacity={0.85}
                >
                  <View style={[tipStyles.cardImageContainer, isLocalAsset ? { backgroundColor: '#F9FAFB' } : {}]}>
                    <Image
                      source={imageSrc}
                      style={tipStyles.cardImage}
                      resizeMode={isLocalAsset ? "contain" : "cover"}
                    />
                  </View>
                  <View style={tipStyles.cardContent}>
                    <View style={tipStyles.badgeRow}>
                      <View style={[tipStyles.typeBadge, { backgroundColor: item.badgeColor }]}>
                        <Text style={tipStyles.typeText}>{item.type}</Text>
                      </View>
                      <View style={tipStyles.tagBadge}>
                        <Text style={tipStyles.tagText}>{item.tag}</Text>
                      </View>
                    </View>
                    <Text style={tipStyles.cardTitle} numberOfLines={1}>{item.name}</Text>
                    <Text style={tipStyles.cardTeaser} numberOfLines={2}>{item.teaser}</Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>
      </View>

      <Modal
        visible={selectedItem !== null}
        animationType="slide"
        transparent={false}
        onRequestClose={() => setSelectedItem(null)}
      >
        <SafeAreaView style={[tipStyles.modalOverlay, { flex: 1, backgroundColor: '#DA0037' }]} edges={['top', 'right', 'bottom', 'left']}>
          <View style={[tipStyles.modalHeader, { backgroundColor: '#DA0037', borderBottomWidth: 0 }]}>
            <TouchableOpacity onPress={() => setSelectedItem(null)} style={tipStyles.modalBackBtn}>
              <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
            </TouchableOpacity>
            <Text style={[tipStyles.modalHeaderTitle, { color: '#FFFFFF' }]}>Health Tips</Text>
            <View style={{ width: 24 }} />
          </View>

          <View style={{ flex: 1, backgroundColor: '#fdfdfdff' }}>
            {!!selectedItem && (
              <ScrollView style={tipStyles.modalBody} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
                <View style={tipStyles.detailImageContainer}>
                  {(() => {
                    const isModalRemoteUrl = typeof selectedItem.image === 'string' && (selectedItem.image.startsWith('http://') || selectedItem.image.startsWith('https://'));
                    const modalImageSrc = isModalRemoteUrl ? { uri: selectedItem.image } : selectedItem.image;
                    return (
                      <Image
                        source={modalImageSrc}
                        style={tipStyles.detailImage}
                        resizeMode={isModalRemoteUrl ? "cover" : "contain"}
                      />
                    );
                  })()}
                </View>

                <Text style={tipStyles.detailTitle}>{selectedItem.name}</Text>

                <View style={tipStyles.paragraphsContainer}>
                  <Text style={tipStyles.paragraphText}>{selectedItem.teaser}</Text>

                  <View style={tipStyles.nutrientBar}>
                    <Ionicons name="nutrition" size={18} color={selectedItem.badgeColor} style={{ marginRight: 8 }} />
                    <Text style={tipStyles.nutrientLabel}>Key Nutrients: </Text>
                    <Text style={tipStyles.nutrientVal}>{selectedItem.nutrient}</Text>
                  </View>

                  {selectedItem.benefits.map((benefit, idx) => (
                    <Text key={idx} style={tipStyles.paragraphText}>
                      {benefit}
                    </Text>
                  ))}
                </View>
              </ScrollView>
            )}
          </View>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
};

const tipStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF9FA',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    height: 56,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  backBtn: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#DA0037',
    textAlign: 'center',
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#e2dcddff',
    borderRadius: 15,
    marginHorizontal: 15,
    marginBottom: 15,
    padding: 12,
    borderWidth: 1,
    borderColor: '#F3EAEB',
    shadowColor: '#DA0037',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 5,
    elevation: 2,
  },
  cardImageContainer: {
    width: 90,
    height: 90,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#FAF5F6',
    borderWidth: 1,
    borderColor: '#F3EAEB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardImage: {
    width: '100%',
    height: '100%',
  },
  cardContent: {
    flex: 1,
    marginLeft: 15,
    justifyContent: 'center',
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
    gap: 6,
  },
  typeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  typeText: {
    fontSize: 9,
    color: '#FFF',
    fontWeight: 'bold',
  },
  tagBadge: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  tagText: {
    fontSize: 9,
    color: '#4B5563',
    fontWeight: '700',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 4,
  },
  cardTeaser: {
    fontSize: 11,
    color: '#6B7280',
    lineHeight: 15,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: '#FFF9FA',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    height: 56,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  modalBackBtn: {
    padding: 4,
  },
  modalHeaderTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#DA0037',
    textAlign: 'center',
  },
  modalBody: {
    flex: 1,
  },
  detailImageContainer: {
    width: 200,
    height: 200,
    alignSelf: 'center',
    marginTop: 20,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    overflow: 'hidden',
    shadowColor: '#DA0037',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 3,
    justifyContent: 'center',
    alignItems: 'center',
  },
  detailImage: {
    width: '90%',
    height: '90%',
  },
  detailTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#DA0037',
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 10,
  },
  paragraphsContainer: {
    paddingHorizontal: 20,
    marginTop: 10,
  },
  paragraphText: {
    fontSize: 15,
    color: '#333333',
    lineHeight: 23,
    marginBottom: 20,
    textAlign: 'left',
  },
  nutrientBar: {
    backgroundColor: '#FAF5F6',
    borderWidth: 1,
    borderColor: '#F3EAEB',
    borderRadius: 10,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  nutrientLabel: {
    fontWeight: 'bold',
    fontSize: 13,
    color: '#374151',
  },
  nutrientVal: {
    fontSize: 13,
    color: '#4B5563',
    flex: 1,
  },
});

export default TipsScreen;
