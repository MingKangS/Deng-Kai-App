import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button, TextInput, FlatList, TouchableOpacity, Image } from 'react-native';
import { Auth } from 'aws-amplify';
import React, {Component} from 'react';

export default class Account extends Component {

  state = {
    data:[
      {
        "name": "user1",
        "machineID": "machine1"
      },
      {
        "name": "user2",
        "machineID": "machine1"
      },
      {
        "name": "user3",
        "machineID": "machine1"
      },
      {
        "name": "user4",
        "machineID": "machine1"
      },
      {
        "name": "user5",
        "machineID": "machine1"
      },
      {
        "name": "user6",
        "machineID": "machine1"
      },
      {
        "name": "user7",
        "machineID": "machine1"
      },
    ]
  }

  async signOut() {
    console.log("test acc",this,this.props)
    this.props.screenProps("auth")
    try {
        await Auth.signOut();
    } catch (error) {
        console.log('error signing out: ', error);
    }
    this.setState({dummy: 1})
  }

  render() {
    return (
      <View>
        <View style={styles.container}>
          <Button onPress={() => {this.signOut()}} title="Log out">Sign out</Button>
          <StatusBar style="auto" />
          <TouchableOpacity >
            <Image 
              source={require ('../src/assets/plus.png')}
              resizeMode='contain'
              style={{width: 40, height: 40,}}
            />
          </TouchableOpacity>
        </View>
        <FlatList style={{marginBottom: 120}}
          data={this.state.data}
          renderItem={({ item }) => (
            <TouchableOpacity>
              <Text style={styles.listItem}>{item.name}</Text>
            </TouchableOpacity>
        )}
        keyExtractor={item => item.name}
      />
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

