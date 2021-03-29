import React, { useState } from 'react'
import { View, StyleSheet, TouchableOpacity, Text, Image } from 'react-native'


const InitializingScreen = () => {
  

  return (
    <View style={styles.container}>
      <Image 
          source={require ('../src/assets/logo.jpg')}
          resizeMode='contain'
          style={{width: 250, height: 250,}}
        />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  }
  /*row: {
    flexDirection: 'row',
    marginTop: 4,
  },
  link: {
    fontWeight: 'bold',
    color: theme.colors.primary,
  },*/
})

export default InitializingScreen
