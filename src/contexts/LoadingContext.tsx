import React, { createContext, useState, useContext, useRef, ReactNode } from 'react';

interface LoadingContextType {
  isLoading: boolean;
  showLoading: () => void;
  hideLoading: () => void;
  showLoadingLocked: (duration: number) => void;
}

const LoadingContext = createContext<LoadingContextType>({
  isLoading: false,
  showLoading: () => {},
  hideLoading: () => {},
  showLoadingLocked: () => {},
});

interface LoadingProviderProps {
  children: ReactNode;
}

export const LoadingProvider: React.FC<LoadingProviderProps> = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);
  const lockRef = useRef(false);

  const showLoading = () => {
    if (lockRef.current) return;
    setIsLoading(true);
  };

  const hideLoading = () => {
    if (lockRef.current) return;
    setIsLoading(false);
  };

  const showLoadingLocked = (duration: number) => {
    if (lockRef.current) return;
    setIsLoading(true);
    lockRef.current = true;
    setTimeout(() => {
      lockRef.current = false;
      setIsLoading(false);
    }, duration);
  };

  return (
    <LoadingContext.Provider value={{ isLoading, showLoading, hideLoading, showLoadingLocked }}>
      {children}
    </LoadingContext.Provider>
  );
};

export const useLoading = (): LoadingContextType => useContext(LoadingContext);
