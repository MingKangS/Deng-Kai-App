import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button, TextInput, FlatList, TouchableOpacity, Image } from 'react-native';
import { Auth } from 'aws-amplify';
import React, {Component} from 'react';
import Amplify, { API, graphqlOperation, Auth as AmplifyAuth } from 'aws-amplify';
import AWSAppSyncClient, { AUTH_TYPE } from 'aws-appsync';
import awsconfig from '../../aws-exports';

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
      <View>
        <Text>{this.state.username}</Text>
        <Text>{this.state.email}</Text>
        <Button onPress={() => {this.changeCred("email")}} title='Change email'>Change email</Button>
        <Button onPress={() => {this.changeCred("password")}} title='Change password'>Change password</Button>
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

