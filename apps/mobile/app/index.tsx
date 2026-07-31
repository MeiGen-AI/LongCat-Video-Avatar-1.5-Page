import { Link } from 'expo-router';
import { Screen, Title, Body, Button, Card } from '../components';
export default function Intro() {
  return (
    <Screen>
      <Title>Make your entrance.</Title>
      <Body>Fakhm Studio turns one face and one voice into a cinematic avatar performance.</Body>
      <Card style={{ marginTop: 30 }}>
        <Title small>Studio, in your pocket</Title>
        <Body>
          Upload a reference image, choose an audio track, and follow the render from queued to
          delivered.
        </Body>
      </Card>
      <Link href="/(auth)/sign-in" asChild>
        <Button>Sign in</Button>
      </Link>
      <Link href="/(auth)/sign-up" asChild>
        <Button secondary>Create an account</Button>
      </Link>
    </Screen>
  );
}
