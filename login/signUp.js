import React, { Fragment, Component } from 'react'
import { View, StyleSheet } from 'react-native'
import Amplify, { API, graphqlOperation, Auth as AmplifyAuth } from 'aws-amplify';
import { Input, ActionButton } from './components/Index'
import { Auth } from 'aws-amplify'
import awsconfig from '../aws-exports';
import * as mutations from './../graphql/mutations';
import AWSAppSyncClient, { AUTH_TYPE } from 'aws-appsync';

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

class SignIn extends Component {
  state = {
    username: '',
    password: '',
    email: '',
    phone_number: '',
    authCode: '',
    stage: 0
  }
  onChangeText = (key, value) => {
    this.setState({ [key]: value })
  }
  signUp = async () => {
    const {
      username, password, email
    } = this.state
    try {
      await Auth.signUp({ username, password, attributes: { email }})
      console.log('successful sign up..')
      this.setState({ stage: 1 })
    } catch (err) {
      console.log('error signing up...', err)
    }
    try {
      const newUser = {
        Email: this.state.email,
        Username: this.state.username,
        Password: this.state.password,
      };
      //const newTodo = await API.graphql({ mutation: mutations.createMkTable, variables: {input: todoDetails}, authMode: 'API_KEY',});
      const createUser = await API.graphql({ query: mutations.createUser, variables: {input: newUser}});  
    } catch(err) {
      console.log(err)
    }
    
    
    
  }
  confirmSignUp = async () => {
    const { username, email, password, authCode } = this.state
    try {
      await Auth.confirmSignUp(username, authCode)
      this.setState({ stage: 0 })
    } catch (err) {
      console.log('error signing up...', err)
      return
    }
    try {
      const newUser = {
        Email: email,
        Username: username,
        Password: password,
      };
      //const newTodo = await API.graphql({ mutation: mutations.createMkTable, variables: {input: todoDetails}, authMode: 'API_KEY',});
      const createUser = await API.graphql({ query: mutations.createUser, variables: {input: newUser}});  
    } catch(err) {
      console.log(err)
    }
    console.log("Account created!")
  }
  render() {
    return (
      <View style={styles.container}>
        {
          this.state.stage === Number(0) && (
            <Fragment>
              <Input
                placeholder='Username'
                type='username'
                onChangeText={this.onChangeText}
              />
              <Input
                placeholder='Password'
                type='password'
                onChangeText={this.onChangeText}
                secureTextEntry
              />
              <Input
                placeholder='Email'
                type='email'
                onChangeText={this.onChangeText}
              />
              {/* 
              If you would like to enable phone number as an attribute, uncomment this field
              <Input
                placeholder='Phone Number'
                type='phone_number'
                onChangeText={this.onChangeText}
              /> */}
              <ActionButton
                title='Sign Up'
                onPress={this.signUp}
              />
            </Fragment>
          )
        }
        {
          this.state.stage === Number(1) && (
            <Fragment>
              <Input
                placeholder='Confirmation Code'
                type='authCode'
                onChangeText={this.onChangeText}
              />
              <ActionButton
                title='Confirm Sign Up'
                onPress={this.confirmSignUp}
              />
            </Fragment>
          )
        }
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
  },
  input: {
    backgroundColor: '#fcf3db',
    borderRadius: 30,
    height: 45
  }
})

export default SignIn