import { View, Text, Alert, StyleSheet, Button, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { TextInput } from 'react-native-gesture-handler';
import { Picker } from '@react-native-picker/picker';
import DatePicker from 'react-native-date-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Transaction } from '../../../data/transaction';
import { useNavigation } from '@react-navigation/native';

export const TransactionScreen: React.FC = () => {

    const navigation = useNavigation();
    const [name, setName] = useState('');
    const [type, setType] = useState<'entrada' | 'saida'>('saida');
    const [amount, setAmount] = useState('');
    const [date, setDate] = useState(new Date());
    const [isDatePickerVisible, setIsDatePickerVisible] = useState(false);

    const handleAmountChange = (value: string) => {
        const formattedText = value.replace(',', '.');

        const validText = formattedText.replace(/[^0-9.]/g, '');

        const sanitizeText = validText.split('.').reduce((acc, part, index) => {
            return index === 0 ? part : `${acc}.${part}`;
        });

        setAmount(sanitizeText);

    }
    const handleSave = async () => {
        if (!name || !amount) {
            Alert.alert('Erro', 'Por favor, preencha todos os campos.');
            return;
        }

        const newTransaction: Transaction = {
            id: generateUUID(),
            name,
            type,
            amount: parseFloat(amount),
            date: date.toISOString(),
        };

        try {

            const existingTransactions = await AsyncStorage.getItem('@transactions');
            const transactions: Transaction[] = existingTransactions ? JSON.parse(existingTransactions) : [];

            transactions.push(newTransaction);

            await AsyncStorage.setItem('@transactions', JSON.stringify(transactions));

            Alert.alert('Sucesso', `Transação ${type} salva com sucesso!`)

            setName('');
            setType('saida');
            setAmount('');
            setDate(new Date());

            navigation.goBack();

        } catch (error) {
            Alert.alert('Error', 'Não foi possível salvar a transação.')
        }

    }

    function generateUUID(): string {
        // Gerar um número hexadecimal aleatório de 8 caracteres
        const randomHex = () => Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
      
        // Construir o UUID no formato correto
        return `${randomHex()}-${randomHex()}-4${randomHex().substring(1)}-${(Math.floor(Math.random() * 4) + 8).toString(16)}${randomHex().substring(1)}-${randomHex()}${randomHex()}${randomHex()}`;
      }
      

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Adicionar Transação</Text>

            <Text style={styles.label}>Nome</Text>
            <TextInput
                style={styles.input}
                placeholder='Ex.: Salário'
                value={name}
                onChangeText={setName}
            />

            <Text style={styles.label}>Tipo</Text>
            <View style={styles.pickercontainer}>
                <Picker
                    selectedValue={type}
                    onValueChange={(itemValue) => setType(itemValue as 'entrada' | 'saida')}
                    style={styles.picker}
                >
                    <Picker.Item label='Entrada' value="entrada" />
                    <Picker.Item label='Saída' value="saida" />
                </Picker>
            </View>

            <Text style={styles.label}>Valor</Text>
            <TextInput
                style={styles.input}
                placeholder='Digite o valor'
                keyboardType='decimal-pad'
                value={amount}
                onChangeText={handleAmountChange}
            />

            <Text style={styles.label}>Data</Text>
            <TouchableOpacity
                style={styles.input}
                onPress={() => setIsDatePickerVisible(true)}
            >

                <Text style={styles.datetext}>
                    {date.toLocaleDateString('pt-BR')}
                </Text>
            </TouchableOpacity>

            <DatePicker
                modal
                open={isDatePickerVisible}
                date={date}
                mode="date"
                locale='pt-BR'
                onConfirm={(selectedDate) => {
                    setIsDatePickerVisible(false);
                    setDate(selectedDate);
                }}
                onCancel={() => setIsDatePickerVisible(false)}
            />

            <View style={styles.buttoncontainer}>
                <Button title='Salvar' onPress={handleSave} color="#0047AB" />
            </View>

        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f8f9fa",
        padding: 16
    },

    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: "#0047AB",
        marginBottom: 16,
        textAlign: "center",
    },

    label: {
        fontSize: 16,
        color: "#333",
        marginBottom: 8,
    },

    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
        marginBottom: 16,
        backgroundColor: '#fff',
    },
    pickercontainer: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        marginBottom: 16,
        backgroundColor: '#fff',
    },
    picker: {
        height: 50,
        width: '100%',
    },

    datetext: {
        fontSize: 16,
        color: "#333",
    },

    buttoncontainer: {
        marginTop: 16
    }
})