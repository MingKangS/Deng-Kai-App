import React, {Component} from 'react';
import { createStackNavigator } from 'react-navigation-stack';
import { createAppContainer } from 'react-navigation';
import Users from '../screens/users';
import Sign from '../../login/signUp';

const screens = {
  Create_users: {
    screen: screenProps => <Sign screenProps={value => {
        screenProps.screenProps.handler(value)
    }} />,
    defaultNavigationOptions: ({ navigation }) => {
      return {
        headerTitle: () => <Header title='Create User' navigation={navigation} />
      }
    },
  },  
  Users: {
    screen: Users,
  },
};

// home stack navigator screens
const adminStack = createStackNavigator(screens);

export default createAppContainer(adminStack);