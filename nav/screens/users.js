import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button, TextInput, FlatList, TouchableOpacity, Image } from 'react-native';
import { Auth } from 'aws-amplify';
import React, {Component} from 'react';
import Amplify, { API, graphqlOperation, Auth as AmplifyAuth } from 'aws-amplify';
import AWSAppSyncClient, { AUTH_TYPE } from 'aws-appsync';
import awsconfig from '../../aws-exports';
import * as queries from '../../graphql/queries';
 
Amplify.configure({
  url: awsconfig.aws_appsync_graphqlEndpoint,
  region: awsconfig.aws_appsync_region,
  Auth: {
    type: AUTH_TYPE.API_KEY,
    apiKey: awsconfig.aws_appsync_apiKey,
  },
  API:{
    "aws_appsync_graphqlEndpoint": awsconfig.aws_appsync_graphqlEndpoint,
    "aws_appsync_region": awsconfig.aws_appsync_region,
    "aws_appsync_authenticationType": AUTH_TYPE.API_KEY,
    "aws_appsync_apiKey": awsconfig.aws_appsync_apiKey,
  }
})

class App extends Component {
  state = {
    users:[
      {
        email: 'user1@gmail.com',
        username: 'user1',
        password: 'abc123'
      },
      {
        email: 'user2@gmail.com',
        username: 'user2',
        password: 'abc123'
      },
      {
        email: 'user3@gmail.com',
        username: "user3",
        password: 'abc123'
      },
    ]
  }

  async componentDidMount() {
    
    try {
      const usersList = await API.graphql({ 
        query: queries.listUsers,
        authMode: 'API_KEY',
      });
      // console.log('Scales:',test,typeof test, typeof test.data, typeof test.data.listMkTables.items);
      // const test = await API.graphql(graphqlOperation(ListScales));
      // console.log('Scales: ', test);
      console.log(usersList,)
      console.log(usersList.data.listUserCS.items)
      const users = usersList.data.listUserCS.items
      //t.sort((a,b) => (a.dateTime > b.dateTime) ? 1 : ((b.dateTime > a.dateTime) ? -1 : 0))
      //this.setState({ test: t, loadingData: false });
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
  

  render() {
    return ( 
      <View>
        <View style={styles.container}>
          <StatusBar style="auto" />
          <TouchableOpacity onPress={() => {this.navigateCreateUser()}}>
            <Image 
              source={require ('../src/assets/plus.png')}
              resizeMode='contain'
              style={{width: 40, height: 40,}}
            />
          </TouchableOpacity>
        </View>
        <FlatList style={{marginBottom: 60}}
          data={this.state.users}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => {this.props.navigation.navigate("Blank_page")}}>
              <View style={styles.user}>
              <Text>
                <Text style={styles.title}>Email: </Text>
                <Text style={styles.content}>{item.email}</Text>
              </Text>
              <Text>
                <Text style={styles.title}>Username: </Text>
                <Text style={styles.content}>{item.username}</Text>
              </Text>
              <Text>
                <Text style={styles.title}>Password: </Text>
                <Text style={styles.content}>{item.password}</Text>
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