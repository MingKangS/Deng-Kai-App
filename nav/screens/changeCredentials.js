import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button, TextInput, FlatList, TouchableOpacity, Image, Alert } from 'react-native';
import { Auth } from 'aws-amplify';
import React, {Component} from 'react';
import Amplify, { API, graphqlOperation, Auth as AmplifyAuth } from 'aws-amplify';
import AWSAppSyncClient, { AUTH_TYPE } from 'aws-appsync';
import awsconfig from '../../aws-exports';
import { Input, ActionButton } from './components/Index'
import * as mutations from '../../graphql/mutations';

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

export default class ChangeCredentials extends Component {
  constructor(props) {
    super(props);
    this.state = {
      cred: this.props.navigation.state.params.cred,
      input: "",
      old_password: "",
      email: ""
    };
    this.onChangeText = this.onChangeText.bind(this)
    this.confirmEmail = this.confirmEmail.bind(this)
    this.save = this.save.bind(this)
  }

  onChangeText = (key, value) => {
    this.setState({ [key]: value })
  }

  async confirmEmail() {
    
    const {input, email} = this.state
    console.log(email, input)
    try {
      let result = await Auth.verifyCurrentUserAttributeSubmit("email", input);
      console.log(result)
    } catch (err) {
      console.log(err)
      Alert.alert("Error", "Invalid Confirmation Code")
    }
    console.log(this.props.navigation.state.params)
    this.props.navigation.state.params.refresh
    this.props.navigation.pop()
    
  }

  async save() {
    let user = await Auth.currentAuthenticatedUser();
    const {input, cred, old_password} = this.state
    const email = input
    if (cred == "email") {
      let result = await Auth.updateUserAttributes(user, {
        "email": input,
      });
      await this.setState({email: input, cred: "confirmation code"},this.forceUpdate())
      console.log(this.state.cred,this.state.email)
      console.log(result);

      const update = {
        Username: user.username,
        Email: email,
      };
      console.log(update,user,user.username)
      const newUpdate = await API.graphql({ query: mutations.updateUserCS, variables: {input: update}});

    } else {
      console.log(old_password,input)
      Auth.currentAuthenticatedUser()
        .then(user => {
          return Auth.changePassword(user, old_password, input);
        })
        .then(data => console.log(data))
        .catch(err => {
          console.log(err)
          Alert.alert("Error", "Invalid Old Password")
        });
        
      this.props.navigation.state.params.refresh
      this.props.navigation.pop()
    }
    
    
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
      
        { this.state.cred == 'password' && 
          <Input
            onChangeText={this.onChangeText}
            type='old_password'
            placeholder='Enter old password'
          />
        }

        <Input
          onChangeText={this.onChangeText}
          type='input'
          placeholder={ this.state.cred}
        />
        { 
            this.state.cred == "confirmation code" ? (
              <>
              <Text>We have sent a confirmation code to your email</Text>
              <ActionButton onPress={() => this.confirmEmail()} title='Enter confirmation code'/>
              </>
            ) : (
              <ActionButton onPress={() => this.save()} title='Save'/>
            )
          }
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    margin: 10,
  },
})