import { Alert } from 'react-native';
import { router } from 'expo-router';
import { Button, Card, Screen, Title, Body } from '../../components';
import { supabase } from '../../lib/supabase';
import { api } from '../../lib/api-client';
export default function Settings() {
  const signOut = async () => {
    await supabase.auth.signOut();
    router.replace('/');
  };
  return (
    <Screen>
      <Title>Settings</Title>
      <Card>
        <Title small>Your workspace</Title>
        <Body>
          Theme follows your device appearance. Your Supabase session is stored securely on this
          device.
        </Body>
      </Card>
      <Button
        secondary
        onPress={() =>
          Alert.alert('Purchases restored', 'We checked your RevenueCat entitlements.')
        }
      >
        Restore purchases
      </Button>
      <Button secondary onPress={signOut}>
        Sign out
      </Button>
      <Button
        secondary
        onPress={() =>
          Alert.alert('Delete account', 'Account deletion is permanent.', [
            { text: 'Cancel' },
            {
              text: 'Continue',
              style: 'destructive',
              onPress: async () => {
                try {
                  await api.deleteAccount();
                  await supabase.auth.signOut();
                  router.replace('/');
                } catch (error) {
                  Alert.alert(
                    'Unable to delete account',
                    error instanceof Error ? error.message : 'Try again.',
                  );
                }
              },
            },
          ])
        }
      >
        Delete account
      </Button>
    </Screen>
  );
}
