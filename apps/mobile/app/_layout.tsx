import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Stack } from 'expo-router';
import { useState } from 'react';
import { useEffect } from 'react';
import { OfflineBanner } from '../components';
import { configureNotifications } from '../lib/notifications';
import { configurePurchases } from '../lib/purchases';
export default function RootLayout() {
  const [client] = useState(() => new QueryClient());
  useEffect(() => {
    configurePurchases();
    void configureNotifications();
  }, []);
  return (
    <QueryClientProvider client={client}>
      <OfflineBanner />
      <Stack screenOptions={{ headerShown: false }} />
    </QueryClientProvider>
  );
}
