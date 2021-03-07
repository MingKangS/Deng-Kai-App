import { StatusBar } from 'expo-status-bar';
import React, {Component} from 'react';
import { Button, StyleSheet, Text, View, TextInput, TouchableOpacity, Image} from 'react-native';
import config from '../../aws-exports';
import { withAuthenticator, Authenticator, SignIn, SignUp, ConfirmSignUp, Greetings  } from 'aws-amplify-react-native';
import ListEvents from '../../graphql/ListEvents';
import AllEvents from '../../AllEvents'
import appSyncConfig from '../../aws-exports';
import { graphql, ApolloProvider } from 'react-apollo';
import DeleteEvent from '../../graphql/DeleteEvent';
import {flowRight as compose} from 'lodash';
import { Rehydrated } from 'aws-appsync-react';
import * as queries from '../../graphql/queries';
import * as mutations from '../../graphql/mutations';
import * as subscriptions from '../../graphql/subscriptions';
import Amplify, { API, graphqlOperation, Auth as AmplifyAuth } from 'aws-amplify';
import LoadingData from './loadingData';
import AWSAppSyncClient, { AUTH_TYPE } from 'aws-appsync';
import awsconfig from '../../aws-exports';
import Card from '../shared/card';
import DateTimePicker from "react-native-modal-datetime-picker";

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

/*const client = new AWSAppSyncClient({
  url: awsconfig.aws_appsync_graphqlEndpoint,
  region: awsconfig.aws_appsync_region,
  auth: {
    type: AUTH_TYPE.API_KEY,
    apiKey: awsconfig.aws_appsync_apiKey,
  },
});*/



 
class App extends Component {
  state = {
    test: [],
    client: "",
    dateTime: "",
    loadingData: true,
  }

  constructor(props) {
    super(props);
    this.state = {
      isDateTimePickerVisible: false
    };
    this.state = {
      lastRefresh: Date(Date.now()).toString(),
    }
    this.refreshScreen = this.refreshScreen.bind(this)
  }
 
  showDateTimePicker = () => {
    this.setState({ isDateTimePickerVisible: true });
  };
 
  hideDateTimePicker = () => {
    this.setState({ isDateTimePickerVisible: false });
  };
 
  handleDatePicked = date => {
    console.log("A date has been picked: ", date);
    this.hideDateTimePicker();
  };

  refreshScreen() {
    this.setState({ lastRefresh: Date(Date.now()).toString() })
  }
 

  async componentDidMount() {
    let user = await AmplifyAuth.currentAuthenticatedUser();
    console.log(user)
    console.log(1234)
    try {
      const test = await API.graphql({ 
        query: queries.listWeighingScales,
        authMode: 'API_KEY',
      });
      // console.log('Scales:',test,typeof test, typeof test.data, typeof test.data.listMkTables.items);
      // const test = await API.graphql(graphqlOperation(ListScales));
      // console.log('Scales: ', test);
      console.log(test)
      console.log(test, test.data.listWeighingScales.items, typeof test.data.listWeighingScales.items)
      const t = test.data.listWeighingScales.items
      t.sort((a,b) => (a.dateTime > b.dateTime) ? 1 : ((b.dateTime > a.dateTime) ? -1 : 0))
      this.setState({ test: t, loadingData: false });
      console.log(this.state.loadingData)
    } catch (err) {
      console.log('error: ', err);
    }
  }

  async mutateDb() {
    console.log(12345)
    const cli = this.state.client
    const date = this.state.dateTime
    console.log(cli,date)
    

    try {
    const todoDetails = {
      client: cli,
      dateTime: date,
    };
    //const newTodo = await API.graphql({ mutation: mutations.createMkTable, variables: {input: todoDetails}, authMode: 'API_KEY',});
    const updatedTodo = await API.graphql({ query: mutations.updateMkTable, variables: {input: todoDetails}});  
    } catch(err) {
      console.log(err)
    }
  }
    
    
    
  

  onChangeText = (key, val) => {
    this.setState({ [key]:val });
  }

  render() {
    return ( 
      <View>
        {
          this.state.loadingData && (
            <LoadingData/>
          )
        }
        {
          !this.state.loadingData && (
            /*<View>
              <Text>Data</Text>
              <Text>{this.state.test.map(test => <Text>{test.Weight} <Text>{test.dateTime}{"\n"}</Text></Text>)}</Text>
              <TextInput onChangeText={(text) => this.setState({Weight: text})}></TextInput>
              <TextInput onChangeText={(text) => this.setState({dateTime: text})}></TextInput>
              <Button title="Press Me">change</Button>
            </View>*/

            <View>
              <Text></Text><Text></Text>
              <Button title="Select a date here" onPress={this.showDateTimePicker} />
              <DateTimePicker
                isVisible={this.state.isDateTimePickerVisible}
                onConfirm={this.handleDatePicked}
                onCancel={this.hideDateTimePicker}
              />
              <TouchableOpacity onPress={this.refreshScreen}>
                <Image 
                    source={require ('../src/assets/refresh.png')}
                    resizeMode='contain'
                    style={{width: 50, height: 50, alignSelf: "flex-end"}}
                  />
              </TouchableOpacity>
              <Text>Last Refresh: {this.state.lastRefresh}</Text>
              <Card>
                <Text style={styles.headerText}>Weight Sensing</Text>
                <Text>data</Text>
                <Text>data</Text>
                <Text>data</Text>
              </Card>
              <Card>
                <Text style={styles.headerText}>Image Processing</Text>
                <Text>data</Text>
                <Text>data</Text>
                <Text>data</Text>
              </Card>
            </View>
          )
        }
      </View>

    );
  }
}

const styles = StyleSheet.create({
  headerText: {
    fontWeight: 'bold',
    fontSize: 20,
    color: '#333',
    letterSpacing: 1,
  },
});

export default App;