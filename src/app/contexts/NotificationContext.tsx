'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';
import Notification, { NotificationType } from '../components/Notification';

interface NotificationContextType {
  showNotification: (type: NotificationType, title: string, message?: string) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [notification, setNotification] = useState<{
    show: boolean;
    type: NotificationType;
    title: string;
    message?: string;
  }>({
    show: false,
    type: 'info',
    title: '',
    message: '',
  });

  const showNotification = useCallback((type: NotificationType, title: string, message?: string) => {
    setNotification({ show: true, type, title, message });
    
    // Auto-dismiss después de 5 segundos
    setTimeout(() => {
      setNotification(prev => ({ ...prev, show: false }));
    }, 5000);
  }, []);

  const handleClose = useCallback(() => {
    setNotification(prev => ({ ...prev, show: false }));
  }, []);

  return (
    <NotificationContext.Provider value={{ showNotification }}>
      {children}
      <Notification
        show={notification.show}
        type={notification.type}
        title={notification.title}
        message={notification.message}
        onClose={handleClose}
      />
    </NotificationContext.Provider>
  );
}

export function useNotification() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within NotificationProvider');
  }
  return context;
}
