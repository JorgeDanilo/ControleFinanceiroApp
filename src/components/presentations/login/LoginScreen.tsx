import { View, Text, TextInput, TouchableOpacity } from 'react-native'

export const LoginScreen = () => {
  return (
    <View style={{flex: 1}}>
      <Text>Email</Text>
      <TextInput />

      <Text>Email</Text>
      <TextInput />

      <TouchableOpacity onPress={() => {}}>
        <Text>Login</Text>
      </TouchableOpacity>
    </View>
  )
}