import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button, TextInput, FlatList, TouchableOpacity, Image } from 'react-native';
import { Auth } from 'aws-amplify';
import React, {Component} from 'react';
import Amplify, { API, graphqlOperation, Auth as AmplifyAuth } from 'aws-amplify';
import AWSAppSyncClient, { AUTH_TYPE } from 'aws-appsync';
import awsconfig from '../../aws-exports';
import * as queries from '../../graphql/queries';

class App extends Component {
  constructor(props){
    super(props);
    this.state = {
      users:[],
    };
    this.refreshScreen = this.refreshScreen.bind(this)
  }


  async componentDidMount() {
    
    try {
      const usersList = await API.graphql({ 
        query: queries.listUsers,
        authMode: 'API_KEY',
      });
      console.log(usersList,)
      console.log(usersList.data.listUserCS.items)
      const users = usersList.data.listUserCS.items
      this.setState({ users: users });
    } catch (err) {
      console.log('error: ', err);
    }
    this.setState({ loadingData: false });
    
  }

  navigateCreateUser() {
    console.log(this.props)
    this.props.navigation.navigate("Create_users")
  }
  
  refreshScreen() {
    this.componentDidMount()
  }

  render() {
    return ( 
      <View>
        <View style={styles.container}>
          <StatusBar style="auto" />
          <View style={{flexDirection: 'row-reverse', alignItems: 'center'}}>
            <TouchableOpacity onPress={() => {this.navigateCreateUser()}}>
              <Image 
                source={require ('../src/assets/plus.png')}
                resizeMode='contain'
                style={{width: 40, height: 40,}}
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={this.refreshScreen}>
              <Image 
                source={require ('../src/assets/refresh.png')}
                resizeMode='contain'
                style={{width: 50, height: 50,}}
              />
            </TouchableOpacity>
          </View>
        </View>
        <FlatList style={{marginBottom: 60}}
          data={this.state.users}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => {this.props.navigation.navigate("Blank_page", {username: item.Username, email: item.Email})}}>
              <View style={styles.user}>
                <Text>
                  <Text style={styles.title}>Username: </Text>
                  <Text style={styles.content}>{item.Username}</Text>
                </Text>
                <Text>
                  <Text style={styles.title}>Email: </Text>
                  <Text style={styles.content}>{item.Email}</Text>
                </Text>
              </View>
            </TouchableOpacity>
        )}
        keyExtractor={item => item.username}
      />
      </View>
      
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row-reverse',
    margin: 5,
  },
  headerText: {
    fontWeight: 'bold',
    fontSize: 24,
    color: '#333',
    letterSpacing: 1,
    marginTop: 30,
    marginBottom: 10,
    marginLeft: 20,
  },
  user:{
    margin: 10,
    padding: 30,
    backgroundColor: "#F7F7F7",
    width: "80%",
    alignSelf: "center",
    flexDirection: "column",
    borderRadius: 5,
  },
  title:{
    fontWeight: "bold",
    fontSize: 20,
  },
  content:{
    fontSize: 20,
  },
});

export default App;