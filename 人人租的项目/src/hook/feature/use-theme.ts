import { ConfigProvider } from 'ant-design-vue';
import { ThemeColor } from '@/typing/typing';

export default function useTheme() {
  const setTheme = (theme: ThemeColor) => {
    ConfigProvider.config({
      theme: {
        primaryColor: theme,
      },
    });
  };

  return { setTheme };
}
