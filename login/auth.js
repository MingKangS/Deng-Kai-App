import React from 'react'
import {
  View, Text, StyleSheet, Image, Dimensions, KeyboardAvoidingView, Platform
} from 'react-native'
import SignIn from './signIn'
// import adminCode from './adminCode'
import ForgotPassword from './ForgotPassword'

const { width } = Dimensions.get('window')

class Auth extends React.Component {
  state = {
    userSignIn: false,
    formType: 'userSignIn'
  }

  toggleAuthType = formType => {
    this.setState({ formType })
  }
  
  render() {
    const adminSignIn = this.state.formType === 'adminSignIn'
    const userSignIn = this.state.formType === 'userSignIn'
    const showForgotPassword = this.state.formType === 'showForgotPassword'
    return (
      <KeyboardAvoidingView
      style={styles.container}
        behavior={Platform.Os == "ios" ? "padding" : "height"}
      >
          
        <Image 
          source={require ('./assets/logo.jpg')}
          resizeMode='contain'
          style={{width: 250, height: 250,}}
        />

          {
            showForgotPassword ? (
              <>
                <ForgotPassword toggleAuthType={this.toggleAuthType} />
                <Text style={styles.bottomMessage}>Already signed up? <Text
                style={{color: '#000080'}}
                onPress={() => this.toggleAuthType('userSignIn')}>&nbsp;&nbsp;Sign In</Text></Text>
              </>
            ) : (
              <SignIn
                toggleAuthType={this.toggleAuthType}
                updateAuth={(acc) => this.props.updateAuth(acc)}
                adminSignIn={adminSignIn}
              />
            )
          }
          <View style={{ position: 'absolute', bottom: 40 }}>
        </View>
      </KeyboardAvoidingView>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 40
  },  
  logo: {
    height: width / 2.5
  },
  title: {
    fontSize: 26,
    marginTop: 15,
    fontFamily: 'SourceSansPro-SemiBold',
    color: '#e19f51'
  },
  subtitle: {
    fontSize: 20,
    marginBottom: 20,
    color: 'rgba(0, 0, 0, .75)',
    fontFamily: 'SourceSansPro-Regular',
  },
  bottomMessage: {
    fontFamily: 'SourceSansPro-Regular',
    fontSize: 18
  },
  bottomMessageHighlight: {
    color: '#f4a63b',
    paddingLeft: 10
  }
})

export default Auth