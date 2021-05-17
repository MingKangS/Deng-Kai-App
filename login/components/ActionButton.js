import React from 'react'
import {
  TouchableHighlight, Text, View, StyleSheet
} from 'react-native'

const ActionButton = ({
  onPress, title
}) => (
  <TouchableHighlight
    onPress={onPress}
    style={styles.buttonContainer}
    underlayColor='#111e6c'
  >
    <View style={styles.button}>
      <Text style={styles.buttonText}>{title}</Text>
    </View>
  </TouchableHighlight>
)

const styles = StyleSheet.create({
  buttonContainer: {
    backgroundColor: '#000080',
    borderRadius: 25,
  },
  button: {
    height: 50,
    justifyContent: 'center',
    alignItems: 'center'
  },
  buttonText: {
    color: 'white',
    fontSize: 20,
    fontFamily: 'SourceSansPro-SemiBold'
  }
})

export default ActionButton