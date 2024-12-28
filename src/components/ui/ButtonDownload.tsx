import { Alert, PermissionsAndroid, Platform, TouchableOpacity } from 'react-native'
import React, { useEffect } from 'react'
import { Transaction } from '../../data/transaction'
import { formatCurrency } from '../helpers/money-formatter';
import Icon from '@react-native-vector-icons/material-icons';
import RNHTMLtoPDF from 'react-native-html-to-pdf';
import RNFS from 'react-native-fs'; // Para acessar
//  o caminho do arquivo gerado
import FileViewer from 'react-native-file-viewer';

interface ButtonDownloadProps {
    transactions: Transaction[];
}

export const ButtonDownload = ({ transactions }: ButtonDownloadProps) => {

    useEffect(() => {
        requestPermissions()
    })

    const requestPermissions = async () => {
        if (Platform.OS === 'android') {
            try {
                const granted = await PermissionsAndroid.requestMultiple([
                    PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
                    PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
                ]);

                // Verifica se as permissões foram concedidas
                if (
                    granted['android.permission.READ_EXTERNAL_STORAGE'] === PermissionsAndroid.RESULTS.GRANTED &&
                    granted['android.permission.WRITE_EXTERNAL_STORAGE'] === PermissionsAndroid.RESULTS.GRANTED
                ) {
                    console.log('Permissões de armazenamento concedidas');
                } else {
                    console.log('Permissões de armazenamento negadas');
                    Alert.alert('Permissão necessária', 'Por favor, permita o acesso ao armazenamento.');
                }
            } catch (err) {
                console.warn(err);
            }
        }
    };


    const generatePDF = async () => {
        try {
            const htmlContent = `
        <h1>Transações</h1>
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
                    .map(
                        (t) => `
                  <tr>
                    <td>${t.name}</td>
                    <td>${t.type}</td>
                    <td>${t.amount}</td>
                    <td>${t.date}</td>
                  </tr>
                `
                    )
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
            <Icon name='download' size={24} style={{ padding: 20 }} />
        </TouchableOpacity>
    )
}