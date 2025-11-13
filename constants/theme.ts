/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import { Platform } from 'react-native';

// Your new palette, mapped to the theme structure
const tintColorLight = '#5A7A8C'; // primary
const tintColorDark = '#E8E3DC'; // soft-beige

export const Colors = {
  light: {
    text: '#2D2A27', // charcoal
    background: '#F5F1ED', // warm-neutral
    tint: tintColorLight,
    icon: '#9B8F82', // warm-gray
    tabIconDefault: '#9B8F82', // warm-gray
    tabIconSelected: tintColorLight,
  },
  dark: {
    text: '#E8E3DC', // soft-beige
    background: '#2B4450', // primary-dark
    tint: tintColorDark,
    icon: '#9B8F82', // warm-gray
    tabIconDefault: '#9B8F82', // warm-gray
    tabIconSelected: tintColorDark,
  },
};

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'system-ui',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
