import React, {Component} from 'react';
import { createStackNavigator } from 'react-navigation-stack';
import { createAppContainer } from 'react-navigation';
import Users from '../screens/users';
import Sign from '../../login/signUp';
import Blank from '../screens/userBlankPage';
import Header from '../shared/header';

const screens = {
  Users: {
    screen: Users,
    navigationOptions: ({ navigation }) => {
      return {
        headerTitle: () => <Header title='Users' navigation={navigation} />
      }
    },
  },
  Create_users: {
    screen: screenProps => <Sign screenProps={value => {
        screenProps.screenProps.handler(value)
    }} />,
    
  },  
  Blank_page: {
    screen: Blank,
  },
 
};

// home stack navigator screens
const adminStack = createStackNavigator(screens);

export default createAppContainer(adminStack);