import React from 'react';
import { ViewStyle, StyleProp, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme, THEME_COLORS } from '../../contexts/ThemeContext';

interface GradientCardProps {
    children: React.ReactNode;
    style?: StyleProp<ViewStyle>;
    variant?: 'primary' | 'secondary' | 'surface';
    className?: string;
}

export const GradientCard: React.FC<GradientCardProps> = ({
    children,
    style,
    variant = 'surface',
    className
}) => {
    const { isDarkMode, accentColor } = useTheme();
    const theme = isDarkMode ? THEME_COLORS.dark : THEME_COLORS.light;

    const getGradientColors = () => {
        switch (variant) {
            case 'primary':
                return [accentColor, `${accentColor}DD`]; // Slight opacity variation
            case 'secondary':
                return isDarkMode
                    ? ['#334155', '#1E293B']
                    : ['#FFFFFF', '#F1F5F9'];
            case 'surface':
            default:
                return isDarkMode
                    ? ['rgba(30, 41, 59, 0.7)', 'rgba(15, 23, 42, 0.8)']
                    : ['rgba(255, 255, 255, 0.9)', 'rgba(255, 255, 255, 0.8)'];
        }
    };

    return (
        <LinearGradient
            colors={getGradientColors()}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={[
                {
                    borderRadius: 16,
                    padding: 16,
                    shadowColor: "#000",
                    shadowOffset: {
                        width: 0,
                        height: 4,
                    },
                    shadowOpacity: 0.1,
                    shadowRadius: 12,
                    elevation: 5,
                    borderWidth: 1,
                    borderColor: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.5)',
                },
                style
            ]}
            className={className}
        >
            {children}
        </LinearGradient>
    );
};
