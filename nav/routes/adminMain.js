import React, {Component} from 'react';
import { createDrawerNavigator } from "react-navigation-drawer"
import { createAppContainer } from "react-navigation"
import adminStack from './adminStack';
// import HomeScreen from "../src/screens/home";
import Sign from '../../login/signUp';
import { View, Button, StyleSheet, Text, SafeAreaView, TextInput, TouchableOpacity, Image} from 'react-native';
import {DrawerNavigatorItems} from 'react-navigation-drawer'
import HomeStack from './homeStack';
import AboutStack from './aboutStack';
import AccountStack from './accountStack';

const RootDrawerNavigator = createDrawerNavigator({
    Home: {
      screen: HomeStack,
    },
    Account: {
      screen: AccountStack,
    },
    Users: {
      screen: adminStack,
    },
    About: {
      screen: AboutStack,
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