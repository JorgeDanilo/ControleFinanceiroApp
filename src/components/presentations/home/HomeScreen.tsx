import { View, Text, StyleSheet, Dimensions, ActivityIndicator } from 'react-native'
import React, { useEffect, useState } from 'react'
import { LineChart } from 'react-native-chart-kit';
import { FlatList } from 'react-native-gesture-handler';
import { TransactionCard } from '../../ui/TransactionCard';
import { FloatingButton } from '../../ui/FloatingButton';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Transaction } from '../../../data/transaction';
import { useNavigation } from '@react-navigation/native';

export const HomeScreen = () => {

    const navigation = useNavigation();
    const screenWidth = Dimensions.get("window").width;

    const [chartData, setChartData] = useState<any | null>(null);
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(true);

    const processTransactions = (transactions: Transaction[]) => {
        const entrada = transactions
            .filter((item) => item.type === "entrada")
            .map((item) => item.amount);

        const saida = transactions
            .filter((item) => item.type === "saida")
            .map((item) => item.amount);

        const labels = transactions.map((item) => {
            const date = new Date(item.date); // Assumindo que a transação tem uma propriedade 'date'
            const month = date.toLocaleString('pt-BR', { month: 'short' }).toUpperCase(); // Obtém o nome do mês abreviado
            return month;
        });

        const datasets = [
            {
                data: entrada,
                color: () => `rgba(34, 202, 102, 1)`, // cor verde
                strokeWidth: 2
            },
            {
                data: saida,
                color: () => `rgba(255, 99, 71, 1)`, // cor vermelha
                strokeWidth: 2, // largura da linha
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

    if (loading) {
        return (
            <View style={style.container}>
                <ActivityIndicator size="large" color="#0047AB" />
            </View>
        );
    }

    return (
        <View style={style.container}>
            <View style={style.navbar}>
                <Text style={style.title}>Suas  Finanças</Text>
            </View>

            <View style={style.card}>
                <Text style={style.summaryTitle}>Resumo</Text>

                <View style={style.summary}>
                    <Text style={{ fontWeight: '700', fontSize: 16 }}>Entrada:  </Text>
                    <Text style={style.summaryEntry}>
                        R$ {transactions.filter((item) => item.type === "entrada").reduce((acc, item) => acc + item.amount, 0)}, 00
                    </Text>
                </View>

                <View style={style.summary}>
                    <Text style={{ fontWeight: '700', fontSize: 16 }}>Saída:  </Text>
                    <Text style={style.summaryEntry}>
                        R$ {transactions.filter((item) => item.type === "saida").reduce((acc, item) => acc + item.amount, 0)}, 00
                    </Text>
                </View>

                <View style={style.summary}>
                    <Text style={{ fontWeight: '700', fontSize: 16 }}>Saldo:  </Text>
                    <Text style={style.summaryEntry}>
                        R$ {transactions.filter((item) => item.type === "entrada").reduce((acc, item) => acc + item.amount, 0) -
                            transactions.filter((item) => item.type === "saida").reduce((acc, item) => acc + item.amount, 0)}, 00
                    </Text>
                </View>
            </View>

            <View style={style.chartcard}>
                <Text style={style.summaryTitle}>Gráfico de Entradas e Saídas</Text>

                <LineChart
                    data={chartData}
                    width={screenWidth - 20}
                    height={200}
                    chartConfig={{
                        backgroundColor: "#f5f5f5",
                        backgroundGradientFrom: "#ffffff",
                        backgroundGradientTo: "#eeeeee",
                        decimalPlaces: 2,
                        color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                        labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                        style: {
                            borderRadius: 16,
                        },
                        propsForDots: {
                            r: "6", // tamanho dos pontos,
                            strokeWidth: 2,
                        },
                    }}
                    bezier // deixa o grafico com linhas suavidadas
                    style={{
                        justifyContent: 'center',
                        marginVertical: 8,
                        borderRadius: 16,
                    }}
                />
            </View>

            <View style={[style.transactioncard]} >
                <Text style={style.summaryTitle}>Transações</Text>

                <FlatList
                    data={transactions}
                    keyExtractor={(item) => item.date}
                    renderItem={({ item }) => (
                        <TransactionCard
                            type={item.type}
                            name={item.name}
                            amount={item.amount}
                        />
                    )}
                />
            </View>

            <FloatingButton
                onPress={() => { navigation.navigate('TransactionScreen')}}
                buttonStyle={style.floatingbutton}
            />
        </View>
    )
}

const style = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F8F9FA",
    },

    navbar: {
        backgroundColor: '#0047AB',
        height: 100,
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
        fontSize: 28,
        fontWeight: "700"
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