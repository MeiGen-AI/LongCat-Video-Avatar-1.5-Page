import { useState } from 'react';
import { Link, router } from 'expo-router';
import { Button, Field, Screen, Title, Body } from '../../components';
import { supabase } from '../../lib/supabase';
export default function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const submit = async () => {
    const result = await supabase.auth.signInWithPassword({ email, password });
    if (result.error) setError(result.error.message);
    else router.replace('/(tabs)/studio');
  };
  return (
    <Screen>
      <Title>Welcome back.</Title>
      <Body>Sign in to continue creating.</Body>
      <Field label="Email" value={email} onChangeText={setEmail} />
      <Field label="Password" value={password} onChangeText={setPassword} secureTextEntry />
      <Button onPress={submit}>Sign in</Button>
      <Button
        secondary
        onPress={() =>
          supabase.auth.signInWithOAuth({
            provider: 'google',
            options: { redirectTo: 'fakhmstudio://auth/callback' },
          })
        }
      >
        Continue with Google
      </Button>
      <Button
        secondary
        onPress={() =>
          supabase.auth.signInWithOAuth({
            provider: 'apple',
            options: { redirectTo: 'fakhmstudio://auth/callback' },
          })
        }
      >
        Continue with Apple
      </Button>
      {error ? <Body>{error}</Body> : null}
      <Link href="/(auth)/forgot-password">Forgot password?</Link>
      <Link href="/(auth)/sign-up">Create an account</Link>
    </Screen>
  );
}
