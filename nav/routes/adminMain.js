import React, {Component} from 'react';
import { createDrawerNavigator } from "react-navigation-drawer"
import { createAppContainer } from "react-navigation"
import adminStack from './adminStack';
import Header from '../shared/header';
// import HomeScreen from "../src/screens/home";
import AccountScreen from "../screens/Account";
import Nav from '../screens/home';
import Sign from '../../login/signUp';
import About from '../screens/about';
import { View, Button, StyleSheet, Text, SafeAreaView, TextInput, TouchableOpacity, Image} from 'react-native';
import {DrawerNavigatorItems} from 'react-navigation-drawer'

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
    Users: {
      screen: adminStack,
      defaultNavigationOptions: ({ navigation }) => {
        return {
          headerTitle: () => <Header title='Create User' navigation={navigation} />
        }
      },
    },
    About: {
      screen: About,
      defaultNavigationOptions: ({ navigation }) => {
        return {
          title: () => {<Header title='abt' navigation={navigation} />}
        }
      },
    }
},
{
  contentComponent:(props) => (
      <View style={{flex:1}}>
        <SafeAreaView forceInset={{ top: 'always', horizontal: 'never' }}>
          <DrawerNavigatorItems {...props} />
          <Button title="Logout"/>
        </SafeAreaView>
      </View>
  ),
  drawerOpenRoute: 'DrawerOpen',
  drawerCloseRoute: 'DrawerClose',
  drawerToggleRoute: 'DrawerToggle'
})

export default createAppContainer(RootDrawerNavigator)