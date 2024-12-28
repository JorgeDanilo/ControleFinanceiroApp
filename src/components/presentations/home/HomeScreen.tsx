import { View, Text, StyleSheet, Dimensions, ActivityIndicator, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import { LineChart } from 'react-native-chart-kit';
import { FlatList } from 'react-native-gesture-handler';
import { TransactionCard } from '../../ui/TransactionCard';
import { FloatingButton } from '../../ui/FloatingButton';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Transaction } from '../../../data/transaction';
import { useNavigation } from '@react-navigation/native';
import { formatCurrency } from '../../helpers/money-formatter';
import { ButtonDownload } from '../../ui/ButtonDownload';
import { NavBarComponent } from '../../ui/NavBarComponent';

export const HomeScreen = () => {

    const navigation = useNavigation();

    const [chartData, setChartData] = useState<any | null>(null);
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(true);

    const processTransactions = (transactions: Transaction[]) => {

        const monthlyData: Record<string, { entrada: number; saida: number }> = {};

        for (const item of transactions) {
            const date = new Date(item.date);
            const month = date.toLocaleString('pt-BR', { month: 'short', year: 'numeric' }).toUpperCase();

            if (!monthlyData[month]) {
                monthlyData[month] = { entrada: 0, saida: 0 };
            }

            if (item.type === 'entrada') {
                monthlyData[month].entrada += item.amount;
            } else {
                monthlyData[month].saida += item.amount;
            }
        }

        const labels = Object.keys(monthlyData);
        const entrada = labels.map((month) => monthlyData[month].entrada);
        const saida = labels.map((month) => monthlyData[month].saida);

        const datasets = [
            {
                data: entrada.length > 0 ? entrada : [0],
                color: () => `rgba(34, 202, 102, 1)`,
                strokeWidth: 2
            },
            {
                data: saida.length > 0 ? saida : [0],
                color: () => `rgba(255, 99, 71, 1)`,
                strokeWidth: 2,
            }
        ];

        return {
            labels,
            datasets,
            legend: ["Entrada", "Saída"],
        };
    };

    const fetchDataFromStorage = async () => {
        try {
            setLoading(true);
            const storedTransactions = await AsyncStorage.getItem('@transactions');
            const transactions = storedTransactions ? JSON.parse(storedTransactions) : [];

            setTransactions(transactions);

            const data = processTransactions(transactions);
            setChartData(data);
        } catch (error) {
            console.error('Erro ao carregar transações: ', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        navigation.addListener('focus', () => {
            fetchDataFromStorage();
        })
    }, [navigation]);

    const totalEntradas = transactions
        .filter((item) => item.type === "entrada")
        .reduce((acc, item) => acc + (item.amount || 0), 0);

    const totalSaidas = transactions
        .filter((item) => item.type === "saida")
        .reduce((acc, item) => acc + (item.amount), 0);

    const saldo = totalEntradas - totalSaidas;

    const handleDelete = async (transactionId: string) => {
        try {
            const storedTransactions = await AsyncStorage.getItem('@transactions');
            const transactions = storedTransactions ? JSON.parse(storedTransactions) : [];

            const updatedTransactions = transactions.filter((transaction: { id: string }) => transaction.id !== transactionId);

            await AsyncStorage.setItem("@transactions", JSON.stringify(updatedTransactions));
        } catch (error) {
            console.error('Erro ao excluir transação: ', error);
        } finally {
            fetchDataFromStorage();
        }

    }

    if (loading) {
        return (
            <View style={style.container}>
                <ActivityIndicator size="large" color="#0047AB" />
            </View>
        );
    }

    const renderHeader = () => (
        <>
            <NavBarComponent title='Suas Finanças' />

            <View style={style.card}>
                <View style={style.summarycard}>
                    <Text style={style.summaryTitle}>Resumo</Text>
                    <ButtonDownload transactions={transactions} />
                </View>
                <View style={style.summary}>
                    <Text style={{ fontWeight: '700', fontSize: 16 }}>Entrada: </Text>
                    <Text style={style.summaryEntry}>{formatCurrency(totalEntradas)}</Text>
                </View>
                <View style={style.summary}>
                    <Text style={{ fontWeight: '700', fontSize: 16 }}>Saída: </Text>
                    <Text style={style.summaryEntry}>{formatCurrency(totalSaidas)}</Text>
                </View>
                <View style={style.summary}>
                    <Text style={{ fontWeight: '700', fontSize: 16 }}>Saldo: </Text>
                    <Text style={style.summaryEntry}>{formatCurrency(saldo)}</Text>
                </View>
            </View>


            <View style={style.chartcard}>
                <Text style={style.summaryTitle}>Gráfico de Entradas e Saídas</Text>
                <LineChart
                    data={chartData}
                    width={Dimensions.get("window").width - 20}
                    height={200}
                    chartConfig={{
                        backgroundColor: "#f5f5f5",
                        backgroundGradientFrom: "#ffffff",
                        backgroundGradientTo: "#eeeeee",
                        decimalPlaces: 2,
                        color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                        labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                    }}
                    bezier
                    style={{ marginVertical: 8, borderRadius: 16 }}
                />
            </View>
        </>
    );

    return (
        <View>
            <FlatList
                data={transactions}
                keyExtractor={(item, index) => `${item.id}-${index}`}
                renderItem={({ item }) => (
                    <TransactionCard
                        onDelete={() => handleDelete(item.id)}
                        createdAt={item.date}
                        type={item.type}
                        name={item.name}
                        amount={item.amount}
                    />
                )}
                ListHeaderComponent={renderHeader}
                ListEmptyComponent={
                    <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                        <Text>Sem transações</Text>
                    </View>
                }
                contentContainerStyle={{ paddingBottom: 20 }} // Para evitar sobreposição do botão flutuante
            />
            <FloatingButton
                onPress={() => { navigation.navigate('TransactionScreen') }}
                buttonStyle={style.floatingbutton}
            />
        </View>

    );
}

const style = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F8F9FA",
    },



    card: {
        marginTop: 16,
        marginHorizontal: 8,
        backgroundColor: "white",
        height: 150,
        maxWidth: 600,
        borderRadius: 8,
        boxShadow: "gray"
    },

    chartcard: {
        marginTop: 16,
        marginHorizontal: 8,
        backgroundColor: "white",
        height: 320,
        alignContent: 'center',
        borderRadius: 8,
        boxShadow: "gray"
    },

    summary: {
        alignContent: 'center',
        alignItems: 'center',
        marginVertical: 2,
        marginHorizontal: 20,
        flexDirection: 'row',
    },

    summarycard: {
        flexDirection: 'row',
        alignContent: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
    },

    summaryTitle: {
        color: "#0047AB",
        fontSize: 24,
        fontWeight: '500',
        marginVertical: 10,
        marginHorizontal: 20,

    },

    summaryEntry: {
        color: "#585858",
        marginVertical: 0,
        fontSize: 16,
    },

    transactioncard: {
        marginTop: 16,
        marginHorizontal: 8,
        backgroundColor: "white",
        height: 230,
        borderRadius: 8,
        boxShadow: "gray",
        marginBottom: 50,
    },

    floatingbutton: {
        position: 'absolute',
        bottom: 30,
        right: 20,
    }

});