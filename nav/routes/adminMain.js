import React, {Component} from 'react';
import { createDrawerNavigator } from "react-navigation-drawer"
import { createAppContainer } from "react-navigation"

import Header from '../shared/header';
// import HomeScreen from "../src/screens/home";
import AccountScreen from "../screens/Account";
import Nav from '../screens/home';
import Sign from '../../login/signUp';

const RootDrawerNavigator = createDrawerNavigator({
    Home: {
      screen: Nav,
      defaultNavigationOptions: ({ navigation }) => {
        return {
          title: () => {<Header title='LOOOL' navigation={navigation} />}
        }
      },
    },
    Account: {
      screen: screenProps => <AccountScreen screenProps={value => {
        screenProps.screenProps.handler(value)
    }} />,
      defaultNavigationOptions: ({ navigation }) => {
        return {
          headerTitle: () => <Header title='GameZone' navigation={navigation} />
        }
      },
    },
    Create_User: {
      screen: screenProps => <Sign screenProps={value => {
        screenProps.screenProps.handler(value)
    }} />,
      defaultNavigationOptions: ({ navigation }) => {
        return {
          headerTitle: () => <Header title='Create User' navigation={navigation} />
        }
      },
    }
})

export default createAppContainer(RootDrawerNavigator)