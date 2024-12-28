import { Alert, PermissionsAndroid, Platform } from "react-native";

export const requestPermissions = async () => {
    if (Platform.OS === 'android') {
        try {
            const granted = await PermissionsAndroid.requestMultiple([
                PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
                PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
            ]);

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