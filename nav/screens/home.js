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
      displayedImageData: [],
      imageRange: [0,1],
    };
    this.showDateTimePicker = this.showDateTimePicker.bind(this)
    this.hideDateTimePicker = this.hideDateTimePicker.bind(this)
    this.handleDatePicked = this.handleDatePicked.bind(this)
    this.refreshScreen = this.refreshScreen.bind(this)
    this.getDataRange = this.getDataRange.bind(this)
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
    const d = this.convertDateFormat(date)
    this.setState({ date: d }, () => this.setChartData())
  };

  refreshScreen() {
    this.setState({ loadingData: true });
    this.setState({ lastRefresh: Date(Date.now()).toString() });
    this.componentDidMount()
  }

  // Converts a Date data type to a string of "YYYY-MM-DD" format
  convertDateFormat(date) {
    const month = (date.getMonth()+1).toString() > 9 ? (date.getMonth()+1).toString() : "0" + (date.getMonth()+1).toString();
    const day = date.getDate().toString() > 9 ? date.getDate().toString() : "0" + date.getDate().toString();
    return date.getFullYear().toString() + "-" + month + "-" + day;
  }

  getDataRange(data) {
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
    // Sets the date to be the date today by default
    var d = new Date();
    const dateToday = this.convertDateFormat(d);
    this.setState({ date: dateToday });

    let user = await AmplifyAuth.currentAuthenticatedUser();
    console.log(user);

    // Get data from API
    try {
      // Get weight data from API, then sort it by state then keep it in state
      const weightData = await API.graphql({ 
        query: queries.listWeights,
        authMode: 'API_KEY',
      });
      const weightDataList = weightData.data.listWeightData.items;
      weightDataList.sort((a,b) => (a.dateTime > b.dateTime) ? 1 : ((b.dateTime > a.dateTime) ? -1 : 0));
      this.setState({ weightDataList: weightDataList });
      console.log("Weight data sorted by date: ", weightDataList)

      // Same thing for image data
      const imageData = await API.graphql({ 
        query: queries.listImageProcess,
        authMode: 'API_KEY',
      });
      
      const imageDataList = imageData.data.listImageProcess.items;
      imageDataList.sort((a,b) => (a.Date > b.Date) ? 1 : ((b.Date > a.Date) ? -1 : 0));
      this.setState({ imageDataList: imageDataList });
      console.log("Image data sorted by date: ", imageDataList)
      
    } catch (err) {
      console.log('Error: ', err);
      return
    }

    //this.setState({ date: "2021-04-08" });

    this.setChartData()
  }

  setChartData() {
    // Check which data has the same date as this.state.date, then slice the data list so it only contains the data for the past 5 days
    var ind = false;
    var displayedWeightData = this.state.weightDataList;
    for (var i = 0; i < displayedWeightData.length; i++) {
      console.log(displayedWeightData[i].dateTime.slice(0,10), this.state.date)
      if (displayedWeightData[i].dateTime.slice(0,10) == this.state.date) {
        ind = i+1;
        break;
      }
    }
    // If there is no data that has same date as this.state.date, then set the most recent five days to be displayed by default
    if (!ind) {
      ind = this.state.weightDataList.length - 1
    }
    // Slice the data
    var displayedWeightData = this.state.weightDataList.slice(Math.max(0,ind-5),ind);

    // Map all the point coordinates fo the data to be displayed on the chart
    displayedWeightData = displayedWeightData.map((data,index) => { 
      return { x:index, y:Math.round(data.Weight/1.5), dateTime:data.dateTime};
    })
    console.log("Displayed weight data points", displayedWeightData);

    // Get the range of the highest and lowest weights
    const weightRange = this.getDataRange(displayedWeightData)
    this.setState({ displayedWeightData: displayedWeightData, weightRange: weightRange});
    console.log("Range of weight data: ", weightRange)

    // Do the same exact thing for image
    ind = false;
    var displayedImageData = this.state.imageDataList;
    for (var i = 0; i < displayedImageData.length; i++) {
      console.log(displayedImageData[i].Date.slice(0,10), this.state.date)
      if (displayedImageData[i].Date.slice(0,10) == this.state.date) {
        ind = i+1;
        break;
      }
    }
    if (!ind) {
      ind = this.state.weightDataList.length - 1
    }
    var displayedImageData = this.state.imageDataList.slice(Math.max(0,ind-5),ind);
    displayedImageData = displayedImageData.map((data,index) => { 
      console.log(data,index);
      return { x:index, y:data.Count, dateTime:data.Date};
    })
    console.log(1, displayedImageData);
    const imageRange = this.getDataRange(displayedImageData)
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
                    style={{ height: 200, width: 300 }}
                    data={this.state.displayedWeightData}
                    padding={{ left: 40, bottom: 20, right: 20, top: 20 }}
                    xDomain={{ min: 0, max: 4 }}
                    yDomain={{ min: Math.max(this.state.weightRange[0]-1,0), max: this.state.weightRange[1]+1 }}
                  >
                    <VerticalAxis tickCount={3} theme={{ labels: { formatter: (v) => v.toFixed(2) } }} />
                    <HorizontalAxis tickCount={5} theme={{ labels: { formatter: (v) => this.state.displayedWeightData[v].dateTime.slice(0,10) } }}/>
                    <Area theme={{ gradient: { from: { color: '#ffa502' }, to: { color: '#ffa502', opacity: 0.4 } }}} />
                    <Line theme={{ stroke: { color: '#ffa502', width: 5 }, scatter: { default: { width: 4, height: 4, rx: 2 }} }} />
                  </Chart>
                </Card>
                <Card>
                  <Text style={styles.headerText}>Image Processing</Text>
                  <View style={styles.inputContainer}>
                    
                  </View>
                  <Chart
                    style={{ height: 200, width: 300 }}
                    data={this.state.displayedImageData}
                    padding={{ left: 40, bottom: 20, right: 20, top: 20 }}
                    xDomain={{ min: 0, max: 4 }}
                    yDomain={{ min: Math.max(this.state.imageRange[0]-1,0), max: this.state.imageRange[1]+1 }}
                  >
                    <VerticalAxis tickCount={5} theme={{ labels: { formatter: (v) => v.toFixed(0) } }} />
                    <HorizontalAxis tickCount={5} theme={{ labels: { formatter: (v) => this.state.displayedImageData[v].dateTime.slice(0,10) } }}/>
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