import { useState } from 'react';
import { Link } from 'expo-router';
import { Button, Field, Screen, Title, Body } from '../../components';
import { supabase } from '../../lib/supabase';
export default function SignUp() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const submit = async () => {
    const result = await supabase.auth.signUp({ email, password });
    setMessage(result.error?.message ?? 'Check your inbox to confirm your account.');
  };
  return (
    <Screen>
      <Title>Make your entrance.</Title>
      <Body>Start with a free creative workspace.</Body>
      <Field label="Email" value={email} onChangeText={setEmail} />
      <Field label="Password" value={password} onChangeText={setPassword} secureTextEntry />
      <Button onPress={submit}>Create account</Button>
      {message ? <Body>{message}</Body> : null}
      <Link href="/(auth)/sign-in">Already have an account?</Link>
    </Screen>
  );
}
