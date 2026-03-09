import { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { LoadingOverlay } from '@/components/LoadingOverlay';

interface LoadingContextType {
  showLoading: (message?: string) => void;
  hideLoading: () => void;
}

const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

export const LoadingProvider = ({ children }: { children: ReactNode }) => {
  const [visible, setVisible] = useState(false);
  const [message, setMessage] = useState<string | undefined>();

  const showLoading = useCallback((msg?: string) => {
    setMessage(msg);
    setVisible(true);
  }, []);

  const hideLoading = useCallback(() => {
    setVisible(false);
  }, []);

  return (
    <LoadingContext.Provider value={{ showLoading, hideLoading }}>
      {children}
      <LoadingOverlay visible={visible} message={message} />
    </LoadingContext.Provider>
  );
};

export const useLoading = () => {
  const context = useContext(LoadingContext);
  if (!context) {
    throw new Error('useLoading must be used within a LoadingProvider');
  }
  return context;
};
