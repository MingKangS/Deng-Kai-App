import React, {Component} from 'react';
import { Button, StyleSheet, Text, View, TextInput } from 'react-native';
import * as mutations from '../../graphql/mutations';
import Amplify, { API, graphqlOperation, Auth as AmplifyAuth } from 'aws-amplify';
import AWSAppSyncClient, { AUTH_TYPE } from 'aws-appsync';
import awsconfig from '../../aws-exports';

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
  constructor(props) {
    super(props);
    this.state = {
      username: this.props.navigation.state.params.username,
      email: this.props.navigation.state.params.email
    };
    this.componentDidMount = this.componentDidMount.bind(this)
    this.deleteUser = this.deleteUser.bind(this)
  }

  async componentDidMount() {
    
  
  }

  async deleteUser() {
    const AWS = require('aws-sdk');
    AWS.config.update({
      accessKeyId: 'AKIAQLAHBKARLC2NJRVI',
      secretAccessKey: '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',
      region: 'ap-southeast-1',
    });
    const cognito = new AWS.CognitoIdentityServiceProvider();

    await cognito.adminDeleteUser({
      UserPoolId: 'ap-southeast-1_ZGZS4IHrW',
      Username: this.state.username,
    }).promise();

    try {
      const user = {Username: this.state.username, Email: this.state.email}
      const deleteUser = await API.graphql({ query: mutations.deleteUserCS, variables: {input: user}});  
      console.log(deleteUser)
    } catch (err) {
      console.log('error: ', err);
    }
  }

  render() {
    return ( 
      <View>
        <Text>blank page</Text>
        <Button onPress={() => this.deleteUser()} title='Delete User'/>
      </View>
      
    );
  }
}

export default App;