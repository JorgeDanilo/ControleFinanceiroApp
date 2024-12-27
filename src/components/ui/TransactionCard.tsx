import { View, Text, StyleSheet } from 'react-native'
import React from 'react'

interface Props {
    type: string;
    name: string;
    amount: number;
}

export const TransactionCard = ({ type, name, amount }: Props) => {

    const borderColor = type == "entrada" ? "#22CA66" : "#FF6347";

    return (
        <View style={[styles.card, { borderLeftColor: borderColor }]}>
            <View style={styles.content}>
                <Text style={styles.name}>{name}</Text>
                <Text style={[styles.amount, { color: borderColor }]}>
                    {type == "entrada" ? `+ R$ ${amount}` : `- R$ ${amount}`}
                </Text>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    card: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 8,
        marginVertical: 8,
        padding: 16,
        borderLeftWidth: 6, // define a largura da borda inicial
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    content: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    name: {
        fontSize: 16,
        fontWeight: 'bold',
        color: "#333",
    },
    amount: {
        fontSize: 16,
        fontWeight: 'bold'
    },
});