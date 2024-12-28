import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native'
import React from 'react'
import { formatCurrency } from '../helpers/money-formatter';
import Icon from '@react-native-vector-icons/material-icons';

interface Props {
    type: string;
    name: string;
    amount: number;
    createdAt: string;
    onDelete: () => void;
}

export const TransactionCard = ({ type, name, amount, createdAt, onDelete }: Props) => {

    const borderColor = type == "entrada" ? "#22CA66" : "#FF6347";
    const formattedDate = new Date(createdAt).toLocaleDateString('pt-BR');

    const handleDelete = () => {
        Alert.alert(
            "Confirma Exclusão",
            "Tem certeza que deseja excluir esta transação?",
            [
                { text: "Cancelar", style: "cancel" },
                { text: "Excluir", style: "destructive", onPress: onDelete }
            ]
        )
    }
    return (
        <View style={[styles.card, { borderLeftColor: borderColor }]}>
            <View style={styles.content}>
                <Text style={styles.name}>{name}</Text>
                <Text style={[styles.amount, { color: borderColor }]}>
                    {type == "entrada" ? `+${formatCurrency(amount)}` : `- ${formatCurrency(amount)}`}
                </Text>
            </View>

            <View style={styles.footer}>
                <Text style={styles.date}>{formattedDate}</Text>
                <TouchableOpacity onPress={handleDelete} style={styles.deleteButton}>
                    <Icon name='delete' size={23} color="#FF6357" />
                </TouchableOpacity>
            </View>
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
        borderLeftWidth: 6,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    content: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
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
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 8,
    },
    date: {
        fontSize: 12,
        color: '#888',
    },
    deleteButton: {
        padding: 8,
        marginLeft: -30
    },


});