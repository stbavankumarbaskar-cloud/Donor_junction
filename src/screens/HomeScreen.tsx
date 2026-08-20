import React, { useState, useEffect, useRef } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StatusBar, Image, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useIsFocused, RouteProp } from '@react-navigation/native';
import { styles } from '../styles/globalStyles';
import { API_URL } from '../constants/theme';
import { nutritionTips } from '../data/nutritionTipsData';
import { useLoading } from '../contexts/LoadingContext';
import { User, Campaign } from '../types';
import { MainTabParamList, RootStackParamList } from '../types/navigation';
import { CompositeNavigationProp } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { StackNavigationProp } from '@react-navigation/stack';

type HomeScreenNavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<MainTabParamList, 'Home'>,
  StackNavigationProp<RootStackParamList>
>;

type HomeScreenProps = {
  navigation: HomeScreenNavigationProp;
  route: RouteProp<MainTabParamList, 'Home'>;
};

const { width, height } = Dimensions.get('window');

const HomeScreen: React.FC<HomeScreenProps> = ({ navigation, route }) => {
  const isFocused = useIsFocused();
  const [user, setUser] = useState<User>(route.params?.user || { name: 'Guest', blood_group: 'N/A', city: 'Unknown' });
  const [campaignsCount, setCampaignsCount] = useState(0);
  const [urgentCampaign, setUrgentCampaign] = useState<Campaign | null>(null);
  const { showLoading, hideLoading, showLoadingLocked } = useLoading();

  const carouselRef = useRef<ScrollView>(null);
  const currentIndexRef = useRef(0);

  useEffect(() => {
    if (!nutritionTips || nutritionTips.length === 0) return;
    const interval = setInterval(() => {
      currentIndexRef.current = (currentIndexRef.current + 1) % nutritionTips.length;
      if (carouselRef.current) {
        const itemWidth = (width * 0.88) + 15;
        carouselRef.current.scrollTo({ x: currentIndexRef.current * itemWidth, animated: true });
      }
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  const loadCampaignStats = async () => {
    try {
      showLoading();
      const storedUser = await AsyncStorage.getItem('user');
      const parsedUser = storedUser ? JSON.parse(storedUser) : null;
      const cityFilter = parsedUser?.city?.toLowerCase()?.trim() || '';

      const response = await fetch(`${API_URL}/get_campaigns.php`).catch(() => null);
      if (response && response.ok) {
        const text = await response.text().catch(() => null);
        const resData = text ? JSON.parse(text) : null;
        if (resData && resData.status === 'success' && Array.isArray(resData.campaigns) && resData.campaigns.length > 0) {
          const allCampaigns: Campaign[] = resData.campaigns;
          let filteredCampaigns = allCampaigns;
          if (cityFilter) {
            const safeCity = cityFilter.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            const cityRegex = new RegExp(safeCity, 'i');
            filteredCampaigns = allCampaigns.filter((camp) => {
              const place = String(camp.place || camp.location || '');
              const title = String(camp.title || '');
              return cityRegex.test(place) || cityRegex.test(title);
            });
          }

          setCampaignsCount(allCampaigns.length);
          const urgent = filteredCampaigns.find((camp) => camp.status?.toLowerCase() === 'urgent') || (allCampaigns.length > 0 ? allCampaigns[0] : null);
          setUrgentCampaign(urgent);
          return;
        }
      }

      // Safe fallback when backend is starting or offline
      const fallbackCampaigns: Campaign[] = [
        { id: 1, title: 'Mega Blood Donation Camp', org_name: 'Rotary Club & Donor Junction', place: 'Anna Nagar Community Center, Chennai', date: '2026-09-01', time: '09:00 AM - 04:00 PM', description: 'Join our monthly blood donation drive.', status: 'urgent' },
        { id: 2, title: 'Youth Lifesavers Drive', org_name: 'Red Cross Society', place: 'GRD College Campus, Coimbatore', date: '2026-09-10', time: '10:00 AM - 03:00 PM', description: 'Blood donation drive organized for college students.', status: 'normal' }
      ];
      setCampaignsCount(fallbackCampaigns.length);
      setUrgentCampaign(fallbackCampaigns[0]);
    } catch (error) {
      // Handled cleanly
    } finally {
      setTimeout(() => {
        hideLoading();
      }, 1500);
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', async () => {
      try {
        const storedUser = await AsyncStorage.getItem('user');
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        } else if (route.params?.user) {
          setUser(route.params.user);
        }
      } catch {
        // Silenced
      }
      await loadCampaignStats();
    });
    return unsubscribe;
  }, [navigation, route.params?.user]);

  useEffect(() => {
    loadCampaignStats();
  }, []);

  const handleNavigation = (screenName: any) => {
    showLoadingLocked(2000);
    setTimeout(() => {
      navigation.navigate(screenName);
    }, 1800);
  };

  const shortcuts = [
    {
      label: 'Health Tips',
      image: require('../assets/images/health_tips_icon.png'),
      onPress: () => handleNavigation('Tips'),
    },
    {
      label: 'Chat',
      image: require('../assets/images/chat_icon.png'),
      onPress: () => handleNavigation('Chat'),
    },
    {
      label: 'Find Donor',
      image: require('../assets/images/find_donor_icon.png'),
      onPress: () => handleNavigation('Map'),
    },
    {
      label: 'Post',
      image: require('../assets/images/post_icon.png'),
      onPress: () => handleNavigation('Posts'),
    },
    {
      label: 'Certification',
      image: require('../assets/images/certification_icon.png'),
      onPress: () => handleNavigation('Certificates'),
    },
  ];

  const itemWidth = (width - 70) / 3;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: '#f8f8f8' }]} edges={['right', 'bottom', 'left']}>
      {isFocused && <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />}

      {/* Top Header */}
      <View style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: 45,
        paddingBottom: 15,
        backgroundColor: '#FFFFFF',
      }}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <TouchableOpacity onPress={() => navigation.navigate('Settings' as any)}>
            <View style={{
              width: 50,
              height: 50,
              borderRadius: 25,
              backgroundColor: '#FFEAEA',
              justifyContent: 'center',
              alignItems: 'center',
              marginRight: 12,
              borderWidth: 2,
              borderColor: '#DA0037',
              overflow: 'hidden'
            }}>
              {user?.profile_image ? (
                <Image source={{ uri: user.profile_image }} style={{ width: '100%', height: '100%' }} />
              ) : (
                <Text style={{ color: '#DA0037', fontWeight: 'bold', fontSize: 18 }}>
                  {user?.name ? user.name[0].toUpperCase() : 'U'}
                </Text>
              )}
            </View>
          </TouchableOpacity>
          <View>
            <Text style={{
              color: '#8E8E93',
              fontSize: 12,
              fontWeight: 'bold',
              letterSpacing: 0.5,
              textTransform: 'uppercase',
              marginBottom: 2
            }}>
              Welcome
            </Text>
            <Text style={{
              color: '#000000',
              fontSize: 22,
              fontWeight: 'bold',
            }}>
              {(user?.name || 'guest').toLowerCase()}{' '}
              <Text style={{ color: '#DA0037' }}>{user?.blood_group || 'N/A'}</Text>
            </Text>
          </View>
        </View>
        <TouchableOpacity onPress={() => navigation.navigate('Notifications')}>
          <View style={{ position: 'relative', padding: 4 }}>
            <Ionicons name="notifications-outline" size={26} color="#000000" />
            <View style={{
              position: 'absolute',
              right: 2,
              top: 2,
              backgroundColor: '#faf8f8ff',
              width: 9,
              height: 9,
              borderRadius: 4.5,
              borderWidth: 1.5,
              borderColor: '#FFFFFF'
            }} />
          </View>
        </TouchableOpacity>
      </View>

      <ScrollView style={{ flex: 1, backgroundColor: '#EAEAEA' }} contentContainerStyle={{ flexGrow: 1, paddingBottom: 90 }}>
        {/* Carousel Container */}
        <View style={{ backgroundColor: '#f8f8f8' }}>
          <ScrollView
            ref={carouselRef}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingLeft: 20, paddingBottom: 25, paddingTop: 10, paddingRight: 20 }}
            snapToInterval={width * 0.88 + 15}
            snapToAlignment="start"
            decelerationRate="fast"
            disableIntervalMomentum={true}
          >
            {nutritionTips.map((item) => {
              const isRemoteUrl = typeof item.image === 'string' && (item.image.startsWith('http://') || item.image.startsWith('https://'));
              const imageSrc = isRemoteUrl ? { uri: item.image } : item.image;
              return (
                <TouchableOpacity
                  key={item.id.toString()}
                  style={{
                    width: width * 0.88,
                    backgroundColor: '#F0F2F4',
                    borderRadius: 20,
                    padding: 15,
                    marginRight: 15,
                    height: 150,
                    flexDirection: 'row',
                    alignItems: 'center'
                  }}
                  onPress={() => navigation.navigate('Tips')}
                >
                  <Image
                    source={imageSrc}
                    style={{ width: 120, height: 120, borderRadius: 8, marginRight: 15, backgroundColor: '#FFFFFF' }}
                    resizeMode="cover"
                  />
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#000000', marginBottom: 4 }} numberOfLines={1}>{item.name}</Text>
                    <Text style={{ fontSize: 12, color: '#333333', lineHeight: 18 }} numberOfLines={4}>{item.teaser}</Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* Lower gray container for shortcuts */}
        <View style={{
          backgroundColor: '#EAEAEA',
          flex: 1,
          paddingTop: 25,
          paddingBottom: 20,
        }}>
          <View style={{ paddingHorizontal: 20 }}>
            {/* Row 1 */}
            <View style={{
              flexDirection: 'row',
              justifyContent: 'center',
              gap: 15,
              marginBottom: 15,
            }}>
              {shortcuts.slice(0, 3).map((item, index) => (
                <TouchableOpacity
                  key={index}
                  style={{
                    width: itemWidth,
                    height: itemWidth,
                    backgroundColor: '#FFFFFF',
                    borderRadius: 20,
                    justifyContent: 'center',
                    alignItems: 'center',
                    padding: 8,
                    shadowColor: '#000000',
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.05,
                    shadowRadius: 8,
                    elevation: 3,
                  }}
                  onPress={item.onPress}
                  activeOpacity={0.85}
                >
                  <Image
                    source={item.image}
                    style={{ width: 45, height: 45, marginBottom: 8 }}
                    resizeMode="contain"
                  />
                  <Text style={{
                    fontSize: 10,
                    fontWeight: 'bold',
                    color: '#000000',
                    textAlign: 'center',
                  }}>
                    {item.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Row 2 */}
            <View style={{
              flexDirection: 'row',
              justifyContent: 'flex-start',
              gap: 15,
            }}>
              {shortcuts.slice(3, 5).map((item, index) => (
                <TouchableOpacity
                  key={index + 3}
                  style={{
                    width: itemWidth,
                    height: itemWidth,
                    backgroundColor: '#FFFFFF',
                    borderRadius: 20,
                    justifyContent: 'center',
                    alignItems: 'center',
                    padding: 8,
                    shadowColor: '#000000',
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.05,
                    shadowRadius: 8,
                    elevation: 3,
                  }}
                  onPress={item.onPress}
                  activeOpacity={0.85}
                >
                  <Image
                    source={item.image}
                    style={{ width: 45, height: 45, marginBottom: 8 }}
                    resizeMode="contain"
                  />
                  <Text style={{
                    fontSize: 10,
                    fontWeight: 'bold',
                    color: '#000000',
                    textAlign: 'center',
                  }}>
                    {item.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default HomeScreen;
