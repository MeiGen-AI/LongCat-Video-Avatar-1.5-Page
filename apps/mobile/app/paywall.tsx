import { Alert } from 'react-native';
import Purchases from 'react-native-purchases';
import { Button, Card, Screen, Title, Body } from '../components';
export default function Paywall() {
  const purchase = async () => {
    try {
      const offerings = await Purchases.getOfferings();
      const packageToBuy = offerings.current?.availablePackages[0];
      if (!packageToBuy) throw new Error('No offers available');
      await Purchases.purchasePackage(packageToBuy);
      Alert.alert('Welcome to Studio', 'Your plan is now active.');
    } catch (error) {
      Alert.alert(
        'Purchase unavailable',
        error instanceof Error ? error.message : 'Try again later.',
      );
    }
  };
  return (
    <Screen>
      <Title>Choose your pace.</Title>
      <Body>More credits for more performances, with the same cinematic quality.</Body>
      <Card>
        <Title small>Creator</Title>
        <Body>600 monthly credits and room to find your voice.</Body>
        <Button onPress={purchase}>Unlock Creator</Button>
      </Card>
      <Card>
        <Title small>Studio</Title>
        <Body>2,400 monthly credits for teams and prolific creators.</Body>
        <Button onPress={purchase}>Unlock Studio</Button>
      </Card>
    </Screen>
  );
}
