import React from 'react';
import { TextInput, TextInputProps, View, Text } from 'react-native';
import { useTheme, THEME_COLORS } from '../../contexts/ThemeContext';

interface GlassInputProps extends TextInputProps {
    label?: string;
    error?: string;
    icon?: React.ReactNode;
}

export const GlassInput: React.FC<GlassInputProps> = ({
    label,
    error,
    icon,
    style,
    ...props
}) => {
    const { isDarkMode } = useTheme();
    const theme = isDarkMode ? THEME_COLORS.dark : THEME_COLORS.light;

    return (
        <View className="mb-4">
            {label && (
                <Text style={{
                    color: theme.textSecondary,
                    marginBottom: 8,
                    fontSize: 14,
                    fontWeight: '600',
                    marginLeft: 4
                }}>
                    {label}
                </Text>
            )}
            <View style={{
                flexDirection: 'row',
                alignItems: 'center',
                backgroundColor: isDarkMode ? 'rgba(30, 41, 59, 0.5)' : 'rgba(255, 255, 255, 0.8)',
                borderRadius: 30,
                borderWidth: 1,
                borderColor: error ? '#EF4444' : (isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)'),
                paddingHorizontal: 20,
                height: 56,
            }}>
                {icon && <View className="mr-3">{icon}</View>}
                <TextInput
                    placeholderTextColor={isDarkMode ? '#94A3B8' : '#94A3B8'}
                    style={[{
                        flex: 1,
                        color: theme.text,
                        fontSize: 16,
                    }, style]}
                    {...props}
                />
            </View>
            {error && (
                <Text style={{ color: '#EF4444', fontSize: 12, marginTop: 4, marginLeft: 4 }}>
                    {error}
                </Text>
            )}
        </View>
    );
};
