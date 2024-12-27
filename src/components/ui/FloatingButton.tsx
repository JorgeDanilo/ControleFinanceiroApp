import { ViewStyle, TouchableOpacity, StyleSheet } from 'react-native'
import React from 'react'
import Icon from '@react-native-vector-icons/material-icons';

type IconName = 'add' | 'search' | 'home' | 'notifications' | 'settings';

interface FloatingButtonProps {
    onPress: () => void;
    iconName?: IconName;
    buttonStyle?: ViewStyle;
    iconColor?: string;
    iconSize?: number;
}

export const FloatingButton: React.FC<FloatingButtonProps> = ({
    onPress,
    iconName = 'add',
    buttonStyle,
    iconColor = '#fff',
    iconSize = 24,
}) => {
    return (
        <TouchableOpacity
            style={[styles.button, buttonStyle]}
            onPress={onPress}
            activeOpacity={0.8}
        >
            <Icon name={iconName} size={iconSize} color={iconColor} />
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    button: {
        width: 56,
        height: 56,
        backgroundColor: "#0047AB",
        borderRadius: 28,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 6
    }
});