import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button, TextInput, FlatList, TouchableOpacity, Image } from 'react-native';
import { Auth } from 'aws-amplify';
import React, {Component} from 'react';

export default class Account extends Component {

  /*async signOut() {
    console.log("test acc",this,this.props)
    this.props.screenProps("auth")
    try {
        await Auth.signOut();
    } catch (error) {
        console.log('error signing out: ', error);
    }
    this.setState({dummy: 1})
  } */

  render() {
    return (
      <View>
        <Text style={styles.headerText}>Account</Text>
        
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row-reverse',
    margin: 10,
  },
  listItem:{
    margin: 10,
    padding: 30,
    backgroundColor: "#F7F7F7",
    width: "80%",
    alignSelf: "center",
    flexDirection: "row",
    borderRadius: 5,
    fontWeight: "bold",
    fontSize: 20,
  },
});

