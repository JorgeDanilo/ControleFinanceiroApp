import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

interface NavBarProps {
    title?: string;
}

export const NavBarComponent = ({ title }: NavBarProps) => {
    return (
        <View style={styles.navbar}>
            <Text style={styles.title}>{title}</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    navbar: {
        backgroundColor: '#0047AB',
        height: 70,
        justifyContent: 'center',
        alignContent: "center",
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 6
    },

    title: {
        textAlign: "center",
        color: "white",
        fontSize: 22,
        fontWeight: "700"
    },
});