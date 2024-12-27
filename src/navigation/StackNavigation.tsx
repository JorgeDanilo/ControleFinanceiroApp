import { createStackNavigator } from '@react-navigation/stack';
import { HomeScreen } from '../components/presentations/home/HomeScreen';
import { LoginScreen } from '../components/presentations/login/LoginScreen';
import { TransactionScreen } from '../components/presentations/transaction/TransactionScreen';

const Stack = createStackNavigator();

export const StackNavigation = () => {
  return (
    <Stack.Navigator>
      <Stack.Group screenOptions={({ navigation }) => ({
        headerShown: false,
      })}>
        <Stack.Screen name='HomeScren' component={HomeScreen} />
        <Stack.Screen name='TransactionScreen' component={TransactionScreen} />
      </Stack.Group>
    </Stack.Navigator>
  );
}