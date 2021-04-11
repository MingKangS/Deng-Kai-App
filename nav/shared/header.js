import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native';
//import { MaterialIcons } from '@expo/vector-icons';

export default function Header({ title, navigation }) {

  const openMenu = () => {
    navigation.openDrawer();
  }

  return (
    <View style={styles.header}>
      {/*<MaterialIcons name='menu' size={28} onPress={openMenu} style={styles.icon} />*/}
      <TouchableOpacity onPress={openMenu}>
        <Image 
          source={require ('../src/assets/menubar.png')}
          resizeMode='contain'
          style={{width: 25, height: 25,}}
        />
      </TouchableOpacity>
      <Text style={styles.headerText}>{"\t"}{title}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    width: '100%',
    height: '100%',
    flexDirection: 'row',
    
  },
  headerText: {
    fontWeight: 'bold',
    fontSize: 20,
    color: '#333',
    letterSpacing: 1,
    alignItems: 'center', 
    justifyContent: 'center',
  },
}); 