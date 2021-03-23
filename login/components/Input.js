import React from 'react'
import { Dimensions, StyleSheet, TextInput } from 'react-native'

const { width } = Dimensions.get('window')

const Input = ({
  placeholder, type, secureTextEntry = false, onChangeText
}) => (
  <TextInput
    style={styles.input}
    placeholder={placeholder}
    autoCapitalize='none'
    autoCorrect={false}
    onChangeText={v => onChangeText(type, v)}
    secureTextEntry={secureTextEntry}
    placeholderTextColor='#000080'
    selectionColor={'#000080'}
  />
)

const styles = StyleSheet.create({
  input: {
    backgroundColor: '#e6f3f8',
    borderRadius: 30,
    height: 45,
    width: width - 20,
    marginBottom: 10,
    fontSize: 16,
    paddingHorizontal: 14,
    fontFamily: 'SourceSansPro-Regular',
    color: '#000080'
  }
})

export default Input