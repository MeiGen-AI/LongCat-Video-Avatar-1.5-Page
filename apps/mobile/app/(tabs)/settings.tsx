import { Alert } from 'react-native';
import { router } from 'expo-router';
import { Button, Card, Screen, Title, Body } from '../../components';
import { supabase } from '../../lib/supabase';
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
              onPress: () => fetch('/api/me/delete', { method: 'DELETE' }),
            },
          ])
        }
      >
        Delete account
      </Button>
    </Screen>
  );
}
