import React from 'react'
import Auth from './login/auth'
// import Initializing from './nav/Initializing'
import Amplify, { API, graphqlOperation, Auth as AmplifyAuth } from 'aws-amplify';
import AWSAppSyncClient, { AUTH_TYPE } from 'aws-appsync';
import awsconfig from './aws-exports';
import 'crypto-js/lib-typedarrays';
import UserMain from './nav/routes/userMain'
import AdminMain from './nav/routes/adminMain'
import InitializingScreen from './nav/screens/initializing'
//test2
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

class App extends React.Component {
  state = {
    currentView: 'initializing'
  }

  componentDidMount() {
    setTimeout(() => {
      this.checkAuth()
    }, 500);
  }

  updateAuth = (currentView) => {
    this.setState({ currentView })
  }

  checkAuth = async () => {
    try {
      const user = await AmplifyAuth.currentAuthenticatedUser()
      console.log('user is signed in')
      const adminList = {
        "admin1":true,
        "admin2":true,
        "admin3":true,
        "admin4":true
      };
      if (adminList[user.username]) {
        this.setState({ currentView: 'adminNav' })
      } else {
        this.setState({ currentView: 'userNav' })
      }
      
    } catch (err) {
      console.log('user is not signed in')
      this.setState({ currentView: 'auth' })
    }
  }
  
  render() {
    const { currentView } = this.state
    console.log('currentView: ', currentView)
    return (
      <>
        { currentView === 'initializing' && <InitializingScreen/>}
        { currentView === 'auth' && <Auth updateAuth={this.updateAuth} />}
        { currentView === 'userNav' && <UserMain screenProps={{
                    handler: (settings) => { this.updateAuth(settings) }
                }} />}
        { currentView === 'adminNav' && <AdminMain screenProps={{
                    handler: (settings) => { this.updateAuth(settings) }
                }} />}
        
      </>
    )
  }
}

export default App