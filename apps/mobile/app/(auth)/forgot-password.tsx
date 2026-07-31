import { useState } from 'react';
import { Link } from 'expo-router';
import { Button, Field, Screen, Title, Body } from '../../components';
import { supabase } from '../../lib/supabase';
export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const submit = async () => {
    await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: 'fakhmstudio://reset-password',
    });
    setSent(true);
  };
  return (
    <Screen>
      <Title>Find your way back.</Title>
      <Field label="Email" value={email} onChangeText={setEmail} />
      <Button onPress={submit}>Send reset link</Button>
      {sent ? <Body>Check your inbox for a secure reset link.</Body> : null}
      <Link href="/(auth)/sign-in">Back to sign in</Link>
    </Screen>
  );
}
