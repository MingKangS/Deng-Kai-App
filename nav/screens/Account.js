import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button, TextInput, FlatList, TouchableOpacity, Image } from 'react-native';
import { Auth } from 'aws-amplify';
import React, {Component} from 'react';
import Amplify, { API, graphqlOperation, Auth as AmplifyAuth } from 'aws-amplify';
import AWSAppSyncClient, { AUTH_TYPE } from 'aws-appsync';
import awsconfig from '../../aws-exports';
import { ActionButton } from './components/Index';

Amplify.configure({
  url: awsconfig.aws_appsync_graphqlEndpoint,
  region: awsconfig.aws_appsync_region,
  authenticationFlowType: 'USER_PASSWORD_AUTH',
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

AmplifyAuth.configure(awsconfig);

export default class Account extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      email: '',
      password: '',
    };
    this.componentDidMount = this.componentDidMount.bind(this)
    this.changeCred = this.changeCred.bind(this)
  }

  async componentDidMount() {
    const user = await AmplifyAuth.currentAuthenticatedUser()
    console.log(user)
    this.setState({ username: user.username, email: user.attributes.email, password: user.password})
  }

  changeCred(cred) {
    this.props.navigation.navigate("Change_Credentials", {cred: cred, refresh: async () => await this.componentDidMount})
  }

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
      <View style={styles.container}>
        <Text>
          <Text style={styles.title}>Email: </Text>
          <Text style={styles.content}>{this.state.email}</Text>
        </Text>
        <Text>
          <Text style={styles.title}>Username: </Text>
          <Text style={styles.content}>{this.state.username}</Text>
        </Text>
        <View style={styles.button}>
          <View style={styles.button1}>
          <ActionButton onPress={() => {this.changeCred("email")}} title='Change Email' />
          </View>
          <View style={styles.button2}>
          <ActionButton onPress={() => {this.changeCred("password")}} title='Change Password' />
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    margin: 30,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  button1:{
    marginTop: 10,
    margin: 5,
    width: 150,
  },
  button2:{
    marginTop: 10,
    margin: 5,
    width: 180,
  },
  title:{
    fontWeight: "bold",
    fontSize: 20,
  },
  content:{
    fontSize: 20,
  },
});

