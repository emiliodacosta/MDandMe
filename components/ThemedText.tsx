import { Text, type TextProps, StyleSheet } from 'react-native';

// import { useThemeColor } from '@/hooks/useThemeColor';

export type ThemedTextProps = TextProps & {
  lightColor?: string;
  darkColor?: string;
  type?: 'default' | 'title' | 'defaultSemiBold' | 'label' | 'subtitle' | 'link';
};

export function ThemedText({
  style,
  lightColor,
  darkColor,
  type = 'default',
  ...rest
}: ThemedTextProps) {
  // const color = useThemeColor({ light: lightColor, dark: darkColor }, 'text');

  return (
    <Text
      style={[
        // { color },
        type === 'default' ? styles.default : undefined,
        type === 'title' ? styles.title : undefined,
        type === 'defaultSemiBold' ? styles.defaultSemiBold : undefined,
        type === 'label' ? styles.label : undefined,
        // type === 'subtitle' ? styles.subtitle : undefined,
        // type === 'link' ? styles.link : undefined,
        style,
      ]}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  default: {
    fontSize: 16,
    lineHeight: 24,
  },
  defaultSemiBold: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '600',
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    lineHeight: 27,
  },
  label: {
    fontSize: 14,
    fontWeight: '700',
    lineHeight: 20
  },
  // subtitle: {
  //   fontSize: 20,
  //   fontWeight: 'bold',
  // },
  // link: {
  //   lineHeight: 30,
  //   fontSize: 16,
  //   color: '#0a7ea4',
  // },
});
