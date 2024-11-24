import { View, Text, TextInput, TouchableOpacity } from 'react-native'
import React from 'react'

export default function LoginScreen() {
  return (
    <View>
      <Text>Email</Text>
      <TextInput />

      <Text>Email</Text>
      <TextInput />

      <TouchableOpacity>
        <Text>Login</Text>
      </TouchableOpacity>
    </View>
  )
}