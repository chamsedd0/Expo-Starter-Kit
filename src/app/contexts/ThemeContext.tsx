import React, {
  createContext,
  useState,
  useContext,
  ReactNode,
  useEffect
} from 'react';
import { Alert, useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface ThemeContextType {
  isDarkMode: boolean;
  toggleTheme: () => void;
  accentColor: string;
  setAccentColor: (color: string) => void;
  ACCENT_COLORS: Record<string, string>;
  addCustomColor: (color: string) => void;
  customColors: string[];
}

// Premium accent color palettes
export const ACCENT_COLORS = {
  PRIMARY: '#2563EB',    // Royal Blue (Trust, Professionalism)
  SUCCESS: '#059669',    // Emerald (Positive Action, Growth)
  WARNING: '#D97706',    // Amber (Caution, Pending)
  DANGER: '#DC2626',     // Red (Destructive, Errors)
  NEUTRAL: '#475569',    // Slate (Subtle, Backgrounds)
  PURPLE: '#7C3AED',     // Violet (Creative, Special Actions)
};

export const THEME_COLORS = {
  dark: {
    background: '#0F172A', // Slate 900
    surface: '#1E293B',    // Slate 800
    surfaceHighlight: '#334155', // Slate 700
    text: '#F8FAFC',       // Slate 50
    textSecondary: '#94A3B8', // Slate 400
    border: '#334155',     // Slate 700
    inputBackground: '#1E293B',
  },
  light: {
    background: '#F1F5F9', // Slate 100
    surface: '#FFFFFF',    // White
    surfaceHighlight: '#F8FAFC', // Slate 50
    text: '#0F172A',       // Slate 900
    textSecondary: '#64748B', // Slate 500
    border: '#E2E8F0',     // Slate 200
    inputBackground: '#F8FAFC',
  }
};

const ThemeContext = createContext<ThemeContextType>({
  isDarkMode: false,
  toggleTheme: () => { },
  accentColor: ACCENT_COLORS.PRIMARY,
  setAccentColor: () => { },
  ACCENT_COLORS: ACCENT_COLORS,
  addCustomColor: () => { },
  customColors: []
});

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const colorScheme = useColorScheme();
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  const [accentColor, setAccentColor] = useState<string>(ACCENT_COLORS.PRIMARY);
  const [customColors, setCustomColors] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Combine predefined and custom colors
  const combinedAccentColors = {
    ...ACCENT_COLORS,
    ...customColors.reduce((acc, color, index) => {
      acc[`CUSTOM_${index + 1}`] = color;
      return acc;
    }, {} as Record<string, string>)
  };

  const addCustomColor = (color: string) => {
    // Prevent duplicates
    if (!customColors.includes(color)) {
      setCustomColors(prev => [...prev, color]);
    }
  };

  useEffect(() => {
    const loadThemePreference = async () => {
      try {
        const storedTheme = await AsyncStorage.getItem('app_theme');
        const storedCustomColors = await AsyncStorage.getItem('app_custom_colors');

        if (storedTheme === null) {
          setIsDarkMode(colorScheme === 'dark');
        } else {
          setIsDarkMode(JSON.parse(storedTheme));
        }

        if (storedCustomColors) {
          setCustomColors(JSON.parse(storedCustomColors));
        }
      } catch (error) {
        setIsDarkMode(colorScheme === 'dark');
      } finally {
        setIsLoading(false);
      }
    };

    loadThemePreference();
  }, [colorScheme]);

  useEffect(() => {
    if (!isLoading) {
      const saveThemePreference = async () => {
        try {
          await AsyncStorage.setItem('app_theme', JSON.stringify(isDarkMode));
          await AsyncStorage.setItem('app_custom_colors', JSON.stringify(customColors));
        } catch (error) {
          Alert.alert('Error', 'Failed to save theme preference');
        }
      };

      saveThemePreference();
    }
  }, [isDarkMode, customColors, isLoading]);

  const toggleTheme = () => {
    setIsDarkMode(prev => !prev);
  };

  if (isLoading) {
    return null;
  }

  return (
    <ThemeContext.Provider value={{
      isDarkMode,
      toggleTheme,
      accentColor,
      setAccentColor,
      ACCENT_COLORS: combinedAccentColors,
      addCustomColor,
      customColors
    }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export default ThemeProvider;