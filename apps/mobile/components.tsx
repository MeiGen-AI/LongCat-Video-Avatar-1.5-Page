import { ComponentProps, PropsWithChildren, ReactNode, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  AppState,
  Pressable,
  StyleProp,
  StyleSheet,
  Text,
  TextInput,
  View,
  ViewStyle,
} from 'react-native';
import { useTheme } from './lib/theme';

export function Screen({ children }: PropsWithChildren) {
  const c = useTheme();
  return <View style={[styles.screen, { backgroundColor: c.background }]}>{children}</View>;
}
export function Card({
  children,
  style,
  onPress,
  ...props
}: PropsWithChildren<
  { style?: StyleProp<ViewStyle>; onPress?: () => void } & ComponentProps<typeof Pressable>
>) {
  const c = useTheme();
  return onPress ? (
    <Pressable
      {...props}
      onPress={onPress}
      style={[styles.card, { backgroundColor: c.panel, borderColor: `${c.text}18` }, style]}
    >
      {children}
    </Pressable>
  ) : (
    <View
      style={[styles.card, { backgroundColor: c.panel, borderColor: `${c.text}18` }, style]}
      {...props}
    >
      {children}
    </View>
  );
}
export function Title({ children, small = false }: PropsWithChildren<{ small?: boolean }>) {
  const c = useTheme();
  return (
    <Text style={[small ? styles.smallTitle : styles.title, { color: c.text }]}>{children}</Text>
  );
}
export function Body({ children }: PropsWithChildren) {
  const c = useTheme();
  return <Text style={[styles.body, { color: c.muted }]}>{children}</Text>;
}
export function Button({
  children,
  onPress,
  secondary = false,
  loading = false,
  ...props
}: {
  children: ReactNode;
  onPress?: () => void;
  secondary?: boolean;
  loading?: boolean;
} & ComponentProps<typeof Pressable>) {
  const c = useTheme();
  return (
    <Pressable
      {...props}
      accessibilityRole="button"
      onPress={onPress}
      style={[
        styles.button,
        { backgroundColor: secondary ? 'transparent' : c.accent, borderColor: c.accent },
      ]}
    >
      {loading ? (
        <ActivityIndicator color={secondary ? c.accent : c.background} />
      ) : (
        <Text style={{ color: secondary ? c.accent : c.background, fontWeight: '700' }}>
          {children}
        </Text>
      )}
    </Pressable>
  );
}
export function Field({
  label,
  value,
  onChangeText,
  secureTextEntry = false,
  placeholder,
}: {
  label: string;
  value: string;
  onChangeText: (value: string) => void;
  secureTextEntry?: boolean;
  placeholder?: string;
}) {
  const c = useTheme();
  return (
    <View style={styles.field}>
      <Text style={[styles.label, { color: c.muted }]}>{label}</Text>
      <TextInput
        accessibilityLabel={label}
        placeholder={placeholder}
        placeholderTextColor={c.muted}
        secureTextEntry={secureTextEntry}
        value={value}
        onChangeText={onChangeText}
        style={[
          styles.input,
          { color: c.text, borderColor: `${c.text}20`, backgroundColor: c.panel },
        ]}
      />
    </View>
  );
}
export function OfflineBanner() {
  const c = useTheme();
  const [online, setOnline] = useState(true);
  useEffect(() => {
    const update = () => setOnline(AppState.currentState !== 'background');
    const sub = AppState.addEventListener('change', update);
    return () => sub.remove();
  }, []);
  return online ? null : (
    <View style={{ backgroundColor: c.danger, borderRadius: 8, padding: 8, marginBottom: 10 }}>
      <Text style={{ color: '#fff', textAlign: 'center' }}>
        You are offline. Changes will resume when connected.
      </Text>
    </View>
  );
}
const styles = StyleSheet.create({
  screen: { flex: 1, padding: 20 },
  card: { borderWidth: 1, borderRadius: 20, padding: 18, marginBottom: 14 },
  title: { fontSize: 34, fontWeight: '800', letterSpacing: -1, marginBottom: 10 },
  smallTitle: { fontSize: 20, fontWeight: '700', marginBottom: 8 },
  body: { fontSize: 15, lineHeight: 22 },
  button: {
    minHeight: 48,
    borderRadius: 14,
    borderWidth: 1,
    paddingHorizontal: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 6,
  },
  field: { marginBottom: 14 },
  label: { fontSize: 12, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 7 },
  input: { minHeight: 48, borderRadius: 12, borderWidth: 1, paddingHorizontal: 14, fontSize: 16 },
});
