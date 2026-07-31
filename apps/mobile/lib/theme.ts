import { useColorScheme } from 'react-native';

export const colors = {
  dark: {
    background: '#0B0B0D',
    panel: '#121216',
    text: '#F6F0E7',
    muted: '#9A938B',
    accent: '#E8B15A',
    violet: '#9C8BFF',
    danger: '#E88C8C',
  },
  light: {
    background: '#F1E9DC',
    panel: '#FFF9F0',
    text: '#211E1A',
    muted: '#756C60',
    accent: '#A66D19',
    violet: '#6555B7',
    danger: '#A83E3E',
  },
};
export function useTheme() {
  const scheme = useColorScheme();
  return scheme === 'light' ? colors.light : colors.dark;
}
