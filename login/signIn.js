import React, { Component } from 'react'
import { View, Text, TouchableHighlight, StyleSheet } from 'react-native'

import { Auth } from 'aws-amplify'

import { Input, ActionButton } from './components/Index'

class SignIn extends Component {
  state = {
    username: '',
    password: '',
    adminCode: '',
  }
  onChangeText = (key, value) => {
    this.setState({ [key]: value })
  }

  handleSignIn() {
    if (this.props.adminSignIn){
      var adminList = {
        "admin1":true,
        "admin2":true,
        "admin3":true,
        "admin4":true
      };
      if (adminList[this.state.username] && this.state.adminCode == "dengkaiadmin"){
        this.signIn
      }
    } else {
      this.signIn
    }
  }

  signIn = async () => {
    const { username, password } = this.state
    console.log(username,password)
    try {
      await Auth.signIn(username, password)
      console.log('successfully signed in')
      this.props.updateAuth(this.props.adminSignIn ? "adminNav" : "userNav")
    } catch (err) {
      console.log('error signing in...', err)
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
          onPress={this.signIn}
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