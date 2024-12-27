import { View, Text, StyleSheet } from 'react-native'
import React from 'react'
import { formatCurrency } from '../helpers/money-formatter';

interface Props {
    type: string;
    name: string;
    amount: number;
    createdAt: string;
}

export const TransactionCard = ({ type, name, amount, createdAt }: Props) => {

    const borderColor = type == "entrada" ? "#22CA66" : "#FF6347";
    const formattedDate = new Date(createdAt).toLocaleDateString('pt-BR');

    return (
        <View style={[styles.card, { borderLeftColor: borderColor }]}>
            <View style={styles.content}>
                <Text style={styles.name}>{name}</Text>
                <Text style={[styles.amount, { color: borderColor }]}>
                    {type == "entrada" ? `+${formatCurrency(amount)}` : `- ${formatCurrency(amount)}`}
                </Text>
            </View>
    
            <Text style={styles.date}>{formattedDate}</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    card: {
        flexDirection: 'column',
        alignItems: 'stretch',
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
        fontWeight: 'bold',
        top: 0,
    },
    date: {
        fontSize: 12,
        color: '#888',
        marginTop: 4,
    }
});