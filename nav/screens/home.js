import React, { Component } from 'react';
import { Button, StyleSheet, Text, View, TextInput, TouchableOpacity, Image, ScrollView } from 'react-native';
import * as queries from '../../graphql/queries';
import Amplify, { API, graphqlOperation, Auth as AmplifyAuth } from 'aws-amplify';
import LoadingData from './loadingData';
import AWSAppSyncClient, { AUTH_TYPE } from 'aws-appsync';
import awsconfig from '../../aws-exports';
import Card from '../shared/card';
import DateTimePicker from "react-native-modal-datetime-picker";
import { Chart, Line, Area, HorizontalAxis, VerticalAxis } from 'react-native-responsive-linechart'

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
      isDateTimePickerVisible: false,
      lastRefresh: Date(Date.now()).toString(),
      date: Date(Date.now()).toString(),
      weight: "",
      count: "",
      defect: "",
      loadingData: true,
      dataMap: {},
      weightDataList: [],
      displayedWeightData: [],
      weightRange: [0,1],
      imageDataList: [],
      displayedImagetData: [],
      imageRange: [0,1],
    };
    this.showDateTimePicker = this.showDateTimePicker.bind(this)
    this.hideDateTimePicker = this.hideDateTimePicker.bind(this)
    this.handleDatePicked = this.handleDatePicked.bind(this)
    this.refreshScreen = this.refreshScreen.bind(this)
    this.getWeightRange = this.getWeightRange.bind(this)
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
    this.setState({ loadingData: true });
    this.setState({ lastRefresh: Date(Date.now()).toString() });
    this.componentDidMount()
  }

  convertDateFormat(date) {
    const month = (date.getMonth()+1).toString() > 9 ? (date.getMonth()+1).toString() : "0" + (date.getMonth()+1).toString();
    const day = date.getDate().toString() > 9 ? date.getDate().toString() : "0" + date.getDate().toString();
    return date.getFullYear().toString() + "-" + month + "-" + day;
  }

  getWeightRange(data) {
    //const data = this.state.displayedWeightData
    var min = Infinity
    var max = -Infinity
    console.log(data)
    for (var i = 0; i < data.length; i++) {
      console.log(data[i].y,min,max,data[i].y < min,data[i].y > max)
      if (data[i].y < min) {
        min = data[i].y
      }
      if (data[i].y > max) {
        max = data[i].y
      }
    }
    return [min,max]
  }
 

  async componentDidMount() {
    var d = new Date();
    const dateToday = this.convertDateFormat(d);
    this.setState({ date: dateToday });

    let user = await AmplifyAuth.currentAuthenticatedUser();
    console.log(user);
    try {
      const weightData = await API.graphql({ 
        query: queries.listWeights,
        authMode: 'API_KEY',
      });
      
      const weightDataList = weightData.data.listWeightData.items;
      
      weightDataList.sort((a,b) => (a.dateTime > b.dateTime) ? 1 : ((b.dateTime > a.dateTime) ? -1 : 0));
      console.log(weightDataList);
      this.setState({ weightDataList: weightDataList });

      const imageData = await API.graphql({ 
        query: queries.listImageProcess,
        authMode: 'API_KEY',
      });
      console.log("____________________",imageData)
      
      const imageDataList = imageData.data.listImageProcess.items;
      
      imageDataList.sort((a,b) => (a.Date > b.Date) ? 1 : ((b.Date > a.Date) ? -1 : 0));
      console.log(imageDataList);
      this.setState({ imageDataList: imageDataList });
      
      
    } catch (err) {
      console.log('error: ', err);
    }

    this.setState({ date: "2021-04-08" });
    var ind = false;
    var displayedWeightData = this.state.weightDataList;
    for (var i = 0; i < displayedWeightData.length; i++) {
      console.log(displayedWeightData[i].dateTime.slice(0,10), this.state.date, displayedWeightData[i].dateTime.slice(0,10) == this.state.date);
      if (displayedWeightData[i].dateTime.slice(0,10) == this.state.date) {
        ind = i+1;
        break;
      }
    }
    var displayedWeightData = this.state.weightDataList.slice(Math.max(0,ind-7),ind);
    displayedWeightData = displayedWeightData.map((data,index) => { 
      console.log(data,index);
      return { x:index, y:data.Weight};
    })
    console.log(1, displayedWeightData);
    const weightRange = this.getWeightRange(displayedWeightData)
    console.log(weightRange)
    this.setState({ displayedWeightData: displayedWeightData, weightRange: weightRange});

    ind = false;
    var displayedImageData = this.state.imageDataList;
    for (var i = 0; i < displayedImageData.length; i++) {
      //console.log(displayedImageData[i].Date.slice(0,10), this.state.date, displayedWeightData[i].dateTime.slice(0,10) == this.state.date);
      if (displayedImageData[i].Date.slice(0,10) == "04/15/2021") {
        ind = i+1;
        break;
      }
    }
    var displayedImageData = this.state.imageDataList.slice(Math.max(0,ind-7),ind);
    displayedImageData = displayedImageData.map((data,index) => { 
      console.log(data,index);
      return { x:index, y:data.Count};
    })
    console.log(1, displayedImageData);
    const imageRange = this.getWeightRange(displayedImageData)
    console.log(imageRange)
    this.setState({ displayedImageData: displayedImageData, loadingData: false, imageRange: imageRange});
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
            <ScrollView>
              <View style={styles.container}>
                <View style={{flexDirection: 'row-reverse', alignItems: 'center'}}>
                  <TouchableOpacity onPress={this.refreshScreen}>
                    <Image 
                      source={require ('../src/assets/refresh.png')}
                      resizeMode='contain'
                      style={{width: 50, height: 50,}}
                    />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={this.showDateTimePicker}>
                  <Image 
                      source={require ('../src/assets/calendar.png')}
                      resizeMode='contain'
                      style={{width: 35, height: 35,}}
                    />
                  </TouchableOpacity>
                  <DateTimePicker
                    isVisible={this.state.isDateTimePickerVisible}
                    onConfirm={this.handleDatePicked}
                    onCancel={this.hideDateTimePicker}
                  />
                </View>
                <Text>Last Refresh: {this.state.lastRefresh}</Text>
                <Card>
                  <Text style={styles.headerText}>Weight Sensing</Text>
                  <View style={styles.inputContainer}>
                    
                  </View>
                  <Chart
                    style={{ height: 200, width: 360 }}
                    data={this.state.displayedWeightData}
                    padding={{ left: 40, bottom: 20, right: 20, top: 20 }}
                    xDomain={{ min: 0, max: 6 }}
                    yDomain={{ min: this.state.weightRange[0]-0.01, max: this.state.weightRange[1]+0.01 }}
                  >
                    <VerticalAxis tickCount={11} theme={{ labels: { formatter: (v) => v.toFixed(2) } }} />
                    <HorizontalAxis tickCount={5} />
                    <Area theme={{ gradient: { from: { color: '#ffa502' }, to: { color: '#ffa502', opacity: 0.4 } }}} />
                    <Line theme={{ stroke: { color: '#ffa502', width: 5 }, scatter: { default: { width: 4, height: 4, rx: 2 }} }} />
                  </Chart>
                </Card>
                <Card>
                  <Text style={styles.headerText}>Image Processing</Text>
                  <View style={styles.inputContainer}>
                    
                  </View>
                  <Chart
                    style={{ height: 200, width: 360 }}
                    data={this.state.displayedImageData}
                    padding={{ left: 40, bottom: 20, right: 20, top: 20 }}
                    xDomain={{ min: 0, max: 6 }}
                    yDomain={{ min: this.state.imageRange[0]-0.01, max: this.state.imageRange[1]+0.01 }}
                  >
                    <VerticalAxis tickCount={11} theme={{ labels: { formatter: (v) => v.toFixed(2) } }} />
                    <HorizontalAxis tickCount={5} />
                    <Area theme={{ gradient: { from: { color: '#ffa502' }, to: { color: '#ffa502', opacity: 0.4 } }}} />
                    <Line theme={{ stroke: { color: '#ffa502', width: 5 }, scatter: { default: { width: 4, height: 4, rx: 2 }} }} />
                  </Chart>
                </Card>
              </View>
            </ScrollView>
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
  headerText: {
    fontWeight: 'bold',
    fontSize: 20,
    color: '#333',
    letterSpacing: 1,
  },
  inputContainer: {
    flexDirection: 'row',
    margin: 10,
    alignItems: 'center', 
    justifyContent: 'center',
  },
  input: {
    backgroundColor: '#e6f3f8',
    borderRadius: 30,
    height: 45,
    width: 100,
    fontSize: 16,
    paddingHorizontal: 14,
    fontFamily: 'SourceSansPro-Regular',
    color: '#000080',
    marginRight: 10
  }
});

export default App;