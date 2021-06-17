import React, { Component } from 'react'
import { View, Text, TouchableHighlight, StyleSheet, Alert } from 'react-native'

import { Auth } from 'aws-amplify'

import { Input, ActionButton } from './components/Index'

class SignIn extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
      adminCode: '',
    };
    this.onChangeText = this.onChangeText.bind(this)
    this.handleSignIn = this.handleSignIn.bind(this)
    this.signIn = this.signIn.bind(this)
    this.showForgotPassword = this.showForgotPassword.bind(this)
  }
  
  onChangeText = (key, value) => {
    this.setState({ [key]: value })
  }

  async handleSignIn() {
    const adminList = {
        "admin1":true,
        "admin2":true,
        "admin3":true,
        "admin4":true
      };
    if (this.props.adminSignIn){
      
      if (adminList[this.state.username]) {
        if (this.state.adminCode == "dengkaiadmin") {
          await this.signIn()
        }
        else{
          Alert.alert("Sign In Error", "Invalid Admin Code")
        }
      } else {
        console.log("Error: Normal users cannot sign in with admin code")
        Alert.alert("Sign In Error", "Normal users cannot sign in with admin code")
      }
      
    } else if (!this.props.adminSignIn) {
      if (!adminList[this.state.username]) {
        await this.signIn()
      }
      else{
        Alert.alert("Sign In Error", "Admin Code is not entered")
      }
    }
    else {
      
    }
  }

  async signIn() {
    const { username, password } = this.state
    console.log(username,password)
    try {
      await Auth.signIn(username, password)
      console.log('successfully signed in')
      this.props.updateAuth(this.props.adminSignIn ? "adminNav" : "userNav")
    } catch (err) {
      console.log('error signing in...', err)
      Alert.alert("Sign In Error", "Invalid username or password")
    }
  }

  showForgotPassword = () => {
    this.props.toggleAuthType('showForgotPassword')
  }
  
  render() {
    return (
      <View>
        <Input style={styles.input}
          onChangeText={this.onChangeText}
          type='username'
          placeholder='Username'
        />
        <Input
          onChangeText={this.onChangeText}
          type='password'
          placeholder='Password'
          secureTextEntry
        />
        { this.props.adminSignIn && 
          <Input
            onChangeText={this.onChangeText}
            type='adminCode'
            placeholder='Admin code'
          /> }
          { 
            this.props.adminSignIn ? (
              <Text style={styles.bottomMessage}>Not an admin?
                <Text
                  onPress={() => this.props.toggleAuthType('userSignIn')}
                  style={{color: '#000080'}}>&nbsp;&nbsp;Hide admin code.</Text>
              </Text>
            ) : (
              <Text style={styles.bottomMessage}>Are you an admin?
                <Text
                  onPress={() => this.props.toggleAuthType('adminSignIn')}
                  style={{color: '#000080'}}>&nbsp;&nbsp;Enter admin code.</Text>
              </Text>
            )
          }
          
        <ActionButton
          title='Sign In'
          onPress={this.handleSignIn}
        />
        <View style={styles.buttonContainer}>
          <TouchableHighlight onPress={this.showForgotPassword}>
            <Text style={{color: '#000080'}}>Forgot your password?</Text>
          </TouchableHighlight>
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  buttonContainer: {
    paddingTop: 15,
    justifyContent: 'center',
    flexDirection: 'row'
  }
})

export default SignIn