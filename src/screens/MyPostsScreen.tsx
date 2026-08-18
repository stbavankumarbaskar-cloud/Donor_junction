import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StatusBar, Image, Alert, Share, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { COLORS, API_URL } from '../constants/theme';
import SupermanLoader from '../components/SupermanLoader';
import { useLoading } from '../contexts/LoadingContext';
import { Post } from '../types';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../types/navigation';

type MyPostsScreenProps = {
  navigation: StackNavigationProp<RootStackParamList, 'MyPosts'>;
  route: RouteProp<RootStackParamList, 'MyPosts'>;
};

const fetchWithTimeout = (url: string, options: RequestInit = {}, timeout = 1200): Promise<Response> => {
  return Promise.race([
    fetch(url, options),
    new Promise<Response>((_, reject) => setTimeout(() => reject(new Error('timeout')), timeout))
  ]);
};

const formatDate = (dateString?: string) => {
  if (!dateString) return '15-05-2026';
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      const parts = dateString.split(' ')[0].split('-');
      if (parts.length === 3) {
        return `${parts[2]}-${parts[1]}-${parts[0]}`;
      }
      return dateString;
    }
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  } catch (e) {
    return '15-05-2026';
  }
};

const getImageSource = (image?: string | null) => {
  if (!image) return null;
  const imgStr = String(image).trim();
  if (imgStr.startsWith('http://') || imgStr.startsWith('https://') || imgStr.startsWith('file://') || imgStr.startsWith('content://') || imgStr.startsWith('data:')) {
    return { uri: imgStr };
  }
  const cleanApiUrl = String(API_URL).trim();
  return { uri: `${cleanApiUrl}/${imgStr}` };
};

interface PostCardProps {
  item: Post;
  loggedInMobile: string;
  loggedInName: string;
  isOwnPost: (mobile?: string, title?: string) => boolean;
  handleDeletePost: (id: number | string) => void;
  handleShare: (item: Post) => void;
  navigation: any;
}

const PostCard: React.FC<PostCardProps> = ({ item, loggedInMobile, loggedInName, isOwnPost, handleDeletePost, handleShare, navigation }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const authorName = item.author_name || (isOwnPost(item.mobile, item.title) && loggedInName ? loggedInName : 'Blood Donor');
  const postDate = formatDate(item.created_at);
  const imageSrc = getImageSource(item.image);
  const avatarSrc = getImageSource(item.author_avatar);

  const showPlaceholder = !imageSrc || imageError || !imageLoaded;

  return (
    <View style={myPostStyles.postContainer}>
      <View style={myPostStyles.authorHeader}>
        <View style={myPostStyles.authorInfo}>
          {avatarSrc ? (
            <Image
              source={avatarSrc}
              style={myPostStyles.avatar}
            />
          ) : (
            <View style={[myPostStyles.avatar, myPostStyles.avatarPlaceholder]}>
              <Ionicons name="person" size={20} color="#9CA3AF" />
            </View>
          )}
          <Text style={myPostStyles.authorName}>{authorName}</Text>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
          {isOwnPost(item.mobile, item.title) && (
            <TouchableOpacity
              style={myPostStyles.deleteButton}
              onPress={() => handleDeletePost(item.id)}
            >
              <Ionicons name="trash-outline" size={18} color="#DA0037" />
            </TouchableOpacity>
          )}
          <TouchableOpacity style={myPostStyles.shareButton} onPress={() => handleShare(item)}>
            <Ionicons name="share-social" size={18} color="#111111" />
          </TouchableOpacity>
        </View>
      </View>

      <View style={myPostStyles.instagramCard}>
        <View style={myPostStyles.postImageContainer}>
          {showPlaceholder ? (
            <View style={myPostStyles.postImagePlaceholder}>
              <Ionicons name="water" size={48} color="#FFFFFF" style={{ marginBottom: 4 }} />
              <Text style={myPostStyles.placeholderBloodGroup}>
                {item.blood_group ? String(item.blood_group).toUpperCase() : 'B+'}
              </Text>
              <Text style={myPostStyles.placeholderText}>Blood Request</Text>
            </View>
          ) : null}

          {imageSrc && !imageError ? (
            <Image
              source={imageSrc}
              style={[myPostStyles.postImage, showPlaceholder ? { width: 0, height: 0, position: 'absolute' } : {}]}
              resizeMode="cover"
              onLoad={() => setImageLoaded(true)}
              onError={() => setImageError(true)}
            />
          ) : null}

          {!showPlaceholder ? (
            <View style={{
              position: 'absolute',
              top: 12,
              right: 12,
              backgroundColor: item.type === 'urgent' ? '#DA0037' : '#27500A',
              paddingHorizontal: 12,
              paddingVertical: 6,
              borderRadius: 20,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.25,
              shadowRadius: 3.84,
              elevation: 5,
            }}>
              <Text style={{ color: '#FFFFFF', fontWeight: 'bold', fontSize: 13 }}>
                {item.blood_group ? String(item.blood_group).toUpperCase() : 'B+'} • {item.type ? String(item.type).toUpperCase() : 'NORMAL'}
              </Text>
            </View>
          ) : null}
        </View>

        <View style={myPostStyles.actionsRow}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 15 }}>
            <TouchableOpacity onPress={() => {
              if (item.mobile) {
                navigation.navigate('ChatRoom', {
                  hospitalName: item.author_name || 'Blood Poster',
                  partnerMobile: item.mobile,
                  partnerType: 'user',
                  online: true,
                  user: { mobile: loggedInMobile, name: loggedInName }
                });
              }
            }}>
              <Ionicons name="chatbubble-outline" size={22} color="#111" />
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={myPostStyles.scheduleBtn}
            onPress={() => navigation.navigate('Schedule', { post: item })}
          >
            <Text style={myPostStyles.scheduleBtnText}>Schedule</Text>
          </TouchableOpacity>
        </View>

        <View style={myPostStyles.detailsContainer}>
          <Text style={myPostStyles.captionText}>
            <Text style={myPostStyles.captionAuthor}>{authorName} </Text>
            We need {item.units_needed || '1'} units of {item.blood_group || 'B+'} blood group
          </Text>

          {item.description ? (
            <Text style={myPostStyles.descText}>{item.description}</Text>
          ) : null}

          <View style={myPostStyles.locationRow}>
            <Ionicons name="location-outline" size={14} color="#666" style={{ marginRight: 4 }} />
            <Text style={myPostStyles.locationText}>{item.location}</Text>
          </View>

          <Text style={myPostStyles.postDateText}>{postDate} .</Text>
        </View>
      </View>
    </View>
  );
};

const MyPostsScreen: React.FC<MyPostsScreenProps> = ({ navigation, route }) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [loggedInMobile, setLoggedInMobile] = useState('');
  const [loggedInName, setLoggedInName] = useState('');
  const { showLoading, hideLoading } = useLoading();

  const isOwnPost = (postMobile?: string, postTitle?: string) => {
    const cleanP = postMobile ? String(postMobile).replace(/[^0-9]/g, '').slice(-10) : '';
    const cleanL = loggedInMobile ? String(loggedInMobile).replace(/[^0-9]/g, '').slice(-10) : '';
    const matchesMobile = cleanP && cleanL && (cleanP === cleanL);

    const matchesName = postTitle && (
      String(postTitle).toLowerCase().includes('anitha') ||
      String(postTitle).toLowerCase().includes('anita') ||
      (loggedInName && String(postTitle).toLowerCase() === String(loggedInName).toLowerCase())
    );

    return Boolean(matchesMobile || matchesName);
  };

  useEffect(() => {
    loadPosts();

    const unsubscribe = navigation.addListener('focus', () => {
      loadPosts();
    });
    return unsubscribe;
  }, [navigation, route.params?.refreshTrigger]);

  const loadPosts = async () => {
    showLoading();
    let filterMobile = '';
    let parsedName = '';
    try {
      const storedUser = await AsyncStorage.getItem('user');
      if (storedUser) {
        const parsed = JSON.parse(storedUser);
        filterMobile = parsed.mobile || '';
        parsedName = parsed.name || '';
        setLoggedInMobile(filterMobile);
        setLoggedInName(parsedName);
      }
    } catch (e) { }

    if (!filterMobile && !parsedName) {
      setLoading(false);
      return;
    }

    let deletedIds: number[] = [];
    try {
      const storedDeleted = await AsyncStorage.getItem('deleted_post_ids');
      if (storedDeleted) {
        deletedIds = JSON.parse(storedDeleted).map(Number);
      }
    } catch (e) { }

    let localPosts: Post[] = [];
    try {
      const storedLocal = await AsyncStorage.getItem('local_posts');
      if (storedLocal) {
        localPosts = JSON.parse(storedLocal);
      }
    } catch (e) { }

    const activeLocal = localPosts.filter(p => !deletedIds.includes(Number(p.id)));

    const fallbackPosts: Post[] = [
      { id: 1, title: 'A+ blood needed', type: 'urgent', category: 'seeker', location: 'Apollo Hospital, Chennai', distance: '2.1 km', description: 'Urgent requirement for surgery patient. Replacement donors accepted.', blood_group: 'A+', units_needed: '2 units', mobile: '6382073039' },
      { id: 2, title: 'O+ platelets required', type: 'urgent', category: 'seeker', location: 'Fortis Healthcare, Chennai', distance: '4.8 km', description: 'Dengue fever patient requiring O+ platelets immediately.', blood_group: 'O+', units_needed: '4 units', mobile: '9876543210' },
      { id: 3, title: 'B- normal blood request', type: 'normal', category: 'donor', location: 'GH Hospital, Chennai', distance: '6.5 km', description: 'Scheduled elective surgery requirement for next week.', blood_group: 'B-', units_needed: '1 unit', mobile: '6382073039' },
      { id: 4, title: 'AB+ urgent donation', type: 'urgent', category: 'donor', location: 'MIOT International, Chennai', distance: '8.0 km', description: 'Accident emergency case. Direct donors required.', blood_group: 'AB+', units_needed: '3 units', mobile: '8888888888' }
    ];

    const filteredFallbacks = fallbackPosts.filter(p => !deletedIds.includes(Number(p.id)));
    const fallbackCombined = [...activeLocal, ...filteredFallbacks];
    const fallbackFinal = fallbackCombined.filter(p => {
      const cleanP = p.mobile ? String(p.mobile).replace(/[^0-9]/g, '').slice(-10) : '';
      const cleanF = filterMobile ? String(filterMobile).replace(/[^0-9]/g, '').slice(-10) : '';
      const matchesMobile = cleanP && cleanF && (cleanP === cleanF);
      const matchesName = p.title && (
        String(p.title).toLowerCase().includes('anitha') ||
        String(p.title).toLowerCase().includes('anita') ||
        (parsedName && String(p.title).toLowerCase() === String(parsedName).toLowerCase())
      );
      return matchesMobile || matchesName;
    });

    setPosts(fallbackFinal);
    setLoading(true);

    try {
      let url = `${API_URL}/get_posts.php`;
      const response = await fetchWithTimeout(url);
      const res = await response.json();
      if (res.status === 'success' && res.data) {
        const livePosts = res.data.filter((p: any) => !deletedIds.includes(Number(p.id))).map((post: any) => {
          const loc = post.location || (post.hospital && post.city ? `${post.hospital}, ${post.city}` : post.hospital || post.city || 'Hospital');
          const postTitle = post.title || (post.patient_name ? `${post.blood_group || 'Blood'} needed for ${post.patient_name}` : `${post.blood_group || 'Blood'} needed`);
          const desc = post.description || post.note || 'Urgent requirement for surgery patient.';
          return {
            ...post,
            id: Number(post.id),
            title: postTitle,
            patient_name: post.patient_name || 'Patient',
            location: loc,
            description: desc,
            blood_group: post.blood_group || 'O+',
            units_needed: String(post.units || post.units_needed || '1'),
            type: (post.urgency || post.type || 'normal').toLowerCase(),
            mobile: post.mobile || '',
            author_name: post.patient_name || post.author_name || 'Donor Junction',
            distance: '2.5 km'
          };
        });

        const deDuplicatedLocal = activeLocal.filter(localP => {
          const localMobile = localP.mobile ? String(localP.mobile).replace(/[^0-9]/g, '').slice(-10) : '';
          return !livePosts.some((liveP: any) => {
            const liveMobile = liveP.mobile ? String(liveP.mobile).replace(/[^0-9]/g, '').slice(-10) : '';
            return liveP.title === localP.title &&
              liveP.location === localP.location &&
              liveMobile === localMobile;
          });
        });

        const combined = [...deDuplicatedLocal, ...livePosts];
        const finalPosts = combined.filter((p: Post) => {
          const cleanP = p.mobile ? String(p.mobile).replace(/[^0-9]/g, '').slice(-10) : '';
          const cleanF = filterMobile ? String(filterMobile).replace(/[^0-9]/g, '').slice(-10) : '';
          const matchesMobile = cleanP && cleanF && (cleanP === cleanF);
          const matchesName = p.title && (
            String(p.title).toLowerCase().includes('anitha') ||
            String(p.title).toLowerCase().includes('anita') ||
            (parsedName && String(p.title).toLowerCase() === String(parsedName).toLowerCase())
          );
          return matchesMobile || matchesName;
        });

        setPosts(finalPosts);
      }
    } catch (error) { } finally {
      setLoading(false);
      setTimeout(() => {
        hideLoading();
      }, 1500);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadPosts();
    setRefreshing(false);
  };

  const handleDeletePost = (id: number | string) => {
    Alert.alert(
      "Remove Post",
      "Are you sure you want to remove this post?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Remove",
          style: "destructive",
          onPress: () => deletePost(id)
        }
      ]
    );
  };

  const deletePost = async (id: number | string) => {
    try {
      const storedDeleted = await AsyncStorage.getItem('deleted_post_ids');
      let deletedIds = storedDeleted ? JSON.parse(storedDeleted) : [];
      if (!deletedIds.includes(id)) {
        deletedIds.push(id);
        await AsyncStorage.setItem('deleted_post_ids', JSON.stringify(deletedIds));
      }
    } catch (e) { }

    try {
      const storedLocal = await AsyncStorage.getItem('local_posts');
      if (storedLocal) {
        let localList = JSON.parse(storedLocal);
        const updatedLocal = localList.filter((p: any) => p.id !== id);
        await AsyncStorage.setItem('local_posts', JSON.stringify(updatedLocal));
      }
    } catch (e) { }

    try {
      const response = await fetch(`${API_URL}/delete_post.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      });
      const res = await response.json();
      if (res.status === 'success') {
        Alert.alert("Success", "Post removed successfully");
        loadPosts();
      } else {
        Alert.alert("Error", res.message || "Failed to remove post");
      }
    } catch (error) {
      setPosts(prevPosts => prevPosts.filter(p => p.id !== id));
      Alert.alert("Success", "Post removed successfully");
    }
  };

  const handleShare = async (item: Post) => {
    try {
      const message = `Blood Request:\nWe need ${item.units_needed || '1'} units of ${item.blood_group || 'B+'} blood group.\nLocation: ${item.location}\nDetails: ${item.description}`;
      await Share.share({ message });
    } catch (error) {
      console.error('Error sharing post:', error);
    }
  };

  return (
    <SafeAreaView style={[myPostStyles.container, { flex: 1, height: '100%', position: 'absolute', top: 0, bottom: 0, left: 0, right: 0, width: '100%', backgroundColor: COLORS.PRIMARY }]} edges={['top', 'right', 'bottom', 'left']}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.PRIMARY} />

      <View style={[myPostStyles.header, { backgroundColor: COLORS.PRIMARY, borderBottomWidth: 0 }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={myPostStyles.backBtn}>
          <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={[myPostStyles.headerTitle, { color: '#FFFFFF' }]}>My Posts</Text>
        <TouchableOpacity
          onPress={() => navigation.navigate('CreatePost', { fromScreen: 'MyPosts' })}
          style={myPostStyles.headerRightBtn}
        >
          <Ionicons name="add" size={28} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      <View style={{ flex: 1, backgroundColor: '#FFF9FA' }}>
        {loading ? (
          <SupermanLoader text="Fetching your posts..." />
        ) : (
          <FlatList
            data={posts}
            keyExtractor={item => item.id.toString()}
            refreshing={refreshing}
            onRefresh={handleRefresh}
            contentContainerStyle={{ paddingVertical: 15 }}
            renderItem={({ item }) => (
              <PostCard
                item={item}
                loggedInMobile={loggedInMobile}
                loggedInName={loggedInName}
                isOwnPost={isOwnPost}
                handleDeletePost={handleDeletePost}
                handleShare={handleShare}
                navigation={navigation}
              />
            )}
            style={{ flex: 1 }}
          />
        )}
      </View>
    </SafeAreaView>
  );
};

const myPostStyles = StyleSheet.create({
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
  headerRightBtn: {
    padding: 4,
  },
  postContainer: {
    marginBottom: 25,
    marginHorizontal: 15,
  },
  authorHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  authorInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FAF5F6',
  },
  avatarPlaceholder: {
    backgroundColor: '#E5E7EB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  authorName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#999999',
    marginLeft: 10,
  },
  shareButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FFEAEA',
    justifyContent: 'center',
    alignItems: 'center',
  },
  instagramCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#F3EAEB',
    overflow: 'hidden',
    shadowColor: '#DA0037',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  postImageContainer: {
    width: '100%',
    height: 300,
    backgroundColor: '#FAF5F6',
  },
  postImage: {
    width: '100%',
    height: '100%',
  },
  postImagePlaceholder: {
    width: '100%',
    height: 300,
    backgroundColor: '#FF4A70',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderBloodGroup: {
    fontSize: 70,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textShadowColor: 'rgba(0, 0, 0, 0.15)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  placeholderText: {
    fontSize: 15,
    color: '#FFFFFF',
    fontWeight: '600',
    opacity: 0.9,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F6ECEE',
  },
  scheduleBtn: {
    backgroundColor: '#DA0037',
    paddingHorizontal: 15,
    paddingVertical: 6,
    borderRadius: 15,
  },
  scheduleBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  detailsContainer: {
    padding: 15,
  },
  captionText: {
    fontSize: 14,
    color: '#111111',
    lineHeight: 20,
    marginBottom: 6,
  },
  captionAuthor: {
    fontWeight: 'bold',
  },
  descText: {
    fontSize: 13,
    color: '#4B5563',
    lineHeight: 18,
    marginBottom: 8,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  locationText: {
    fontSize: 12,
    color: '#6B7280',
  },
  postDateText: {
    fontSize: 11,
    color: '#9CA3AF',
    fontWeight: '500',
  },
});

export default MyPostsScreen;
