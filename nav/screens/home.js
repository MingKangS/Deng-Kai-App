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
  constructor(props) {
    super(props);
    this.state = {
      isDateTimePickerVisible: false,
      lastRefresh: Date(Date.now()).toString(),
      date: Date(Date.now()).toString(),
      weight: "",
      count: "",
      defect: "",
      test: [], // x
      client: "", // x
      dateTime: "", // x
      loadingData: true,
      dataMap: {},
    };
    this.showDateTimePicker = this.showDateTimePicker.bind(this)
    this.hideDateTimePicker = this.hideDateTimePicker.bind(this)
    this.handleDatePicked = this.handleDatePicked.bind(this)
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

  convertDateFormat(date) {
    console.log(date, typeof date)
    //date = Date(date)
    const month = (date.getMonth()+1).toString() > 9 ? (date.getMonth()+1).toString() : "0" + (date.getMonth()+1).toString()
    const day = date.getDate().toString() > 9 ? date.getDate().toString() : "0" + date.getDate().toString()
    return date.getFullYear().toString() + "-" + month + "-" + day
  }
 

  async componentDidMount() {
    var d = new Date()
    const dateToday = this.convertDateFormat(d)
    this.setState({ date: dateToday })

    let user = await AmplifyAuth.currentAuthenticatedUser();
    console.log(user)
    console.log(this.state.date)
    try {
      const weightData = await API.graphql({ 
        query: queries.listWeights,
        authMode: 'API_KEY',
      });
      // console.log('Scales:',test,typeof test, typeof test.data, typeof test.data.listMkTables.items);
      // const test = await API.graphql(graphqlOperation(ListScales));
      // console.log('Scales: ', test);
      console.log(weightData)
      console.log(weightData, weightData.data.listWeightData.items)
      const weightDataList = weightData.data.listWeightData.items
      //t.sort((a,b) => (a.dateTime > b.dateTime) ? 1 : ((b.dateTime > a.dateTime) ? -1 : 0))
      //this.setState({ test: t, loadingData: false });
      var weightMap = {}
      for (var weight of weightDataList) {
        //console.log(weight, weight.dateTime, weightMap)
        weightMap[weight.dateTime.slice(0,10)] = weight.Weight
      }
      this.setState({ dataMap: weightMap })
      console.log(weightMap)
      //console.log(this.state.loadingData)
    } catch (err) {
      console.log('error: ', err);
    }
    this.setState({ loadingData: false });
    const w = this.state.dataMap[this.state.date]
    this.setState({ weight: w });
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

            <View style={styles.container}>
              <Text style={styles.header}>Home</Text>
              <View style={{flexDirection: 'row-reverse'}}>
                <TouchableOpacity onPress={this.refreshScreen}>
                  <Image 
                    source={require ('../src/assets/refresh.png')}
                    resizeMode='contain'
                    style={{width: 40, height: 40,}}
                  />
              </TouchableOpacity>
              <Button title="Date" onPress={this.showDateTimePicker} />
              <DateTimePicker
                isVisible={this.state.isDateTimePickerVisible}
                onConfirm={this.handleDatePicked}
                onCancel={this.hideDateTimePicker}
              />
              </View>
              <Text>Last Refresh: {this.state.lastRefresh}</Text>
              <Card>
                <Text style={styles.headerText}>Weight Sensing</Text>
                <Text>{this.state.date} {this.state.weight}</Text>
                
              </Card>
              <Card>
                <Text style={styles.headerText}>Image Processing</Text>
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
  container: {
    margin: 10
  },
  header: {
    fontWeight: 'bold',
    fontSize: 24,
    color: '#333',
    letterSpacing: 1,
    marginTop: 20,
  },
  headerText: {
    fontWeight: 'bold',
    fontSize: 20,
    color: '#333',
    letterSpacing: 1,
  },
});

export default App;