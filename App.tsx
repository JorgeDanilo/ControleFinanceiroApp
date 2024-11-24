import { View, Text, StyleSheet } from 'react-native'
import React from 'react'
import LoginScreen from './src/components/screens/LoginScreen'

export default function App() {
  return (
    <View style={styles.container}>
      <LoginScreen />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffff'
  }
})