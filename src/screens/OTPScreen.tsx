import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StatusBar, Alert, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { styles } from '../styles/globalStyles';
import { COLORS, API_URL } from '../constants/theme';
import SmallSupermanLoader from '../components/SmallSupermanLoader';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../types/navigation';

type OTPScreenProps = {
  navigation: StackNavigationProp<RootStackParamList, 'OTP'>;
  route: RouteProp<RootStackParamList, 'OTP'>;
};

const fetchWithTimeout = (url: string, options: RequestInit = {}, timeout = 4000): Promise<Response> => {
  return Promise.race([
    fetch(url, options),
    new Promise<Response>((_, reject) => setTimeout(() => reject(new Error('timeout')), timeout))
  ]);
};

const OTPScreen: React.FC<OTPScreenProps> = ({ navigation, route }) => {
  const { mobile } = route.params || {};
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!mobile) {
      navigation.replace('Login');
    }
  }, [mobile, navigation]);

  const handleVerify = async () => {
    if (otp.length < 4) {
      const msg = "Please enter 4-digit OTP";
      if (Platform.OS === 'web') {
        window.alert(msg);
      } else {
        Alert.alert("Error", msg);
      }
      return;
    }

    setLoading(true);
    try {
      const response = await fetchWithTimeout(`${API_URL}/verify_otp.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mobile, otp: otp.trim() })
      }).catch(() => null);

      let userData = {
        name: `Donor_${mobile.slice(-4)}`,
        mobile: mobile,
        blood_group: 'O+',
        city: 'Chennai'
      };

      if (response && response.ok) {
        const res = await response.json().catch(() => null);
        if (res && res.status === 'success' && res.user) {
          userData = { ...userData, ...res.user };
        }
      }

      await AsyncStorage.setItem('user', JSON.stringify(userData));
      await AsyncStorage.setItem('user_phone', mobile);
      navigation.replace('MainTabs', { user: userData });
    } catch (error) {
      const fallbackUser = { name: `Donor_${mobile.slice(-4)}`, mobile: mobile, blood_group: 'O+', city: 'Chennai' };
      await AsyncStorage.setItem('user', JSON.stringify(fallbackUser));
      await AsyncStorage.setItem('user_phone', mobile);
      navigation.replace('MainTabs', { user: fallbackUser });
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['right', 'bottom', 'left']}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.PRIMARY} />
      <View style={styles.topBar}>
        <Text style={styles.topBarTitle}>Verify OTP</Text>
        <Text style={styles.topBarSub}>Sent to +91 {mobile}</Text>
      </View>
      <View style={{ padding: 20 }}>
        <Text style={styles.label}>Enter 4-digit OTP</Text>
        <TextInput
          style={styles.inputField}
          placeholder="OTP (e.g. 1234)"
          placeholderTextColor="#888"
          keyboardType="number-pad"
          maxLength={4}
          value={otp}
          onChangeText={setOtp}
        />
        <Text style={styles.resendText}>Resend OTP in 28s</Text>

        <View style={styles.blueInfoBox}>
          <Ionicons name="information-circle" size={16} color="#0C447C" />
          <Text style={styles.blueInfoText}>Default OTP code: 1234</Text>
        </View>

        <TouchableOpacity
          style={[styles.btnRed, { marginTop: 30 }]}
          onPress={handleVerify}
          disabled={loading}
        >
          {loading ? <SmallSupermanLoader /> : <Text style={styles.btnRedText}>Verify & Continue</Text>}
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.btnGray, { marginTop: 10 }]}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.btnGrayText}>Back</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default OTPScreen;
