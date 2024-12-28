import { Alert, StyleSheet, TouchableOpacity } from 'react-native'
import React from 'react'
import { Transaction } from '../../data/transaction'
import { formatCurrency } from '../helpers/money-formatter';
import Icon from '@react-native-vector-icons/material-icons';
import RNHTMLtoPDF from 'react-native-html-to-pdf';
import FileViewer from 'react-native-file-viewer';
import { requestPermissions } from '../helpers/permissions';

interface ButtonDownloadProps {
    transactions: Transaction[];
}

export const ButtonDownload = ({ transactions }: ButtonDownloadProps) => {

    const generatePDF = async () => {
        try {
            requestPermissions();

            const htmlContent = `
                <h1>Minhas Transações</h1>
                <table border="1" style="width:100%; border-collapse: collapse;">
                <thead>
                    <tr>
                    <th>Nome</th>
                    <th>Tipo</th>
                    <th>Valor</th>
                    <th>Data</th>
                    </tr>
                </thead>
                    <tbody>
                    ${transactions
                    .map((t) => {
                        const formattedDate = new Date(t.date).toLocaleDateString('pt-BR');
                        return `
                                <tr>
                                <td>${t.name}</td>
                                <td>${t.type === 'entrada' ? 'Entrada' : 'Saída'}</td>
                                <td>${formatCurrency(t.amount)}</td>
                                <td>${formattedDate}</td>
                                </tr>`;
                    })
                    .join('')}
                    </tbody>
                </table>
        `;

            const pdfOptions = {
                html: htmlContent,
                fileName: 'transacoes',
                directory: 'Documents'
            };

            const pdf = await RNHTMLtoPDF.convert(pdfOptions);

            if (pdf.filePath) {
                await FileViewer.open(pdf.filePath, {
                    displayName: 'Minhas transações',
                    showOpenWithDialog: true
                });
            }

            console.log({ transactions });
            Alert.alert('PDF Gerado', `Seu PDF foi gerado com sucesso: ${pdf.filePath}`);
        } catch (error) {
            console.error('Erro ao gerar PDF:', error);
        }

    }
    return (
        <TouchableOpacity onPress={generatePDF}>
            <Icon name='download' size={24} style={styles.button} color="#0047AB" />
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    button: {
        alignSelf: 'flex-end',
        paddingTop: 16,
    }
});