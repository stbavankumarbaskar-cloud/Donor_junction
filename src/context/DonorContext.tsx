import React, { createContext, useContext, useState } from 'react';
import { Donor, EmergencyRequest, UserProfile, BloodGroup } from '../types';
import { MOCK_DONORS, MOCK_EMERGENCIES, MOCK_USER } from '../mock/data';

interface DonorContextType {
  user: UserProfile;
  donors: Donor[];
  emergencies: EmergencyRequest[];
  selectedBloodGroup: BloodGroup | 'ALL';
  setSelectedBloodGroup: (bg: BloodGroup | 'ALL') => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  toggleUserAvailability: () => void;
  addEmergencyRequest: (req: Omit<EmergencyRequest, 'id' | 'createdAt' | 'fulfilled'>) => void;
  respondToEmergency: (id: string) => void;
  toastMessage: string | null;
  showToast: (msg: string) => void;
}

const DonorContext = createContext<DonorContextType | undefined>(undefined);

export const DonorProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile>(MOCK_USER);
  const [donors, setDonors] = useState<Donor[]>(MOCK_DONORS);
  const [emergencies, setEmergencies] = useState<EmergencyRequest[]>(MOCK_EMERGENCIES);
  const [selectedBloodGroup, setSelectedBloodGroup] = useState<BloodGroup | 'ALL'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  const toggleUserAvailability = () => {
    setUser((prev) => {
      const nextState = !prev.isAvailable;
      showToast(nextState ? 'Status set to: Available to Donate ❤️' : 'Status set to: Offline / Unavailable');
      return { ...prev, isAvailable: nextState };
    });
  };

  const addEmergencyRequest = (newReq: Omit<EmergencyRequest, 'id' | 'createdAt' | 'fulfilled'>) => {
    const created: EmergencyRequest = {
      ...newReq,
      id: `e_${Date.now()}`,
      createdAt: 'Just now',
      fulfilled: false,
    };
    setEmergencies((prev) => [created, ...prev]);
    showToast('🚨 Emergency request published to donor network!');
  };

  const respondToEmergency = (id: string) => {
    setEmergencies((prev) =>
      prev.map((item) => (item.id === id ? { ...item, fulfilled: true } : item))
    );
    showToast('🙏 Thank you for volunteering! Hospital contact notified.');
  };

  return (
    <DonorContext.Provider
      value={{
        user,
        donors,
        emergencies,
        selectedBloodGroup,
        setSelectedBloodGroup,
        searchQuery,
        setSearchQuery,
        toggleUserAvailability,
        addEmergencyRequest,
        respondToEmergency,
        toastMessage,
        showToast,
      }}
    >
      {children}
    </DonorContext.Provider>
  );
};

export const useDonorContext = () => {
  const context = useContext(DonorContext);
  if (!context) {
    throw new Error('useDonorContext must be used within a DonorProvider');
  }
  return context;
};
