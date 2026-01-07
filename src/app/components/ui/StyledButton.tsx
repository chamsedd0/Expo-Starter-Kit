import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator, ViewStyle, StyleProp, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { useTheme } from '../../contexts/ThemeContext';

interface StyledButtonProps {
    onPress: () => void;
    title: string;
    loading?: boolean;
    variant?: 'primary' | 'secondary' | 'outline' | 'danger';
    style?: StyleProp<ViewStyle>;
    disabled?: boolean;
    icon?: React.ReactNode;
}

export const StyledButton: React.FC<StyledButtonProps> = ({
    onPress,
    title,
    loading = false,
    variant = 'primary',
    style,
    disabled = false,
    icon
}) => {
    const { accentColor } = useTheme();

    const handlePress = () => {
        if (!loading && !disabled) {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            onPress();
        }
    };

    const getGradientColors = () => {
        if (disabled) return ['#94A3B8', '#64748B'];

        switch (variant) {
            case 'primary':
                // Create a gradient based on the accent color
                return [accentColor, accentColor]; // Simplify to solid for now, or calculate lighter/darker shades
            case 'danger':
                return ['#EF4444', '#DC2626'];
            case 'secondary':
            case 'outline':
            default:
                return ['transparent', 'transparent'];
        }
    };

    const isOutline = variant === 'outline';
    const isSecondary = variant === 'secondary';

    return (
        <TouchableOpacity
            onPress={handlePress}
            disabled={disabled || loading}
            activeOpacity={0.8}
            style={style}
        >
            <LinearGradient
                colors={getGradientColors()}    
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={{
                    borderRadius: 30,
                    paddingVertical: 16,
                    paddingHorizontal: 24,
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexDirection: 'row',
                    borderWidth: isOutline ? 1 : 0,
                    borderColor: isOutline ? accentColor : 'transparent',
                    backgroundColor: isSecondary ? 'rgba(0,0,0,0.05)' : undefined,
                    opacity: disabled ? 0.7 : 1,
                }}
            >
                {loading ? (
                    <ActivityIndicator color={isOutline || isSecondary ? accentColor : 'white'} />
                ) : (
                    <>
                        {icon && <View style={{ marginRight: 8 }}>{icon}</View>}
                        <Text style={{
                            color: isOutline || isSecondary ? accentColor : 'white',
                            fontSize: 16,
                            fontWeight: '600',
                            letterSpacing: 0.5
                        }}>
                            {title}
                        </Text>
                    </>
                )}
            </LinearGradient>
        </TouchableOpacity>
    );
};
