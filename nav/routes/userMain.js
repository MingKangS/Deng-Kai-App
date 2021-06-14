import React, {Component} from 'react';
import { createDrawerNavigator } from "react-navigation-drawer"
import { createAppContainer } from "react-navigation"
import { View, Button, StyleSheet, Text, SafeAreaView, TextInput, TouchableOpacity, Image} from 'react-native';
import {DrawerNavigatorItems} from 'react-navigation-drawer';
import { Auth } from 'aws-amplify';
// import HomeScreen from "../src/screens/home";
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
    About: {
      screen: AboutStack,
      }
},
{
  contentComponent:(props) => (
    <View style={{flex:1}}>
      <SafeAreaView forceInset={{ top: 'always', horizontal: 'never' }}>
        <DrawerNavigatorItems {...props} />
        <Button title="Logout" color='#000080' onPress={async () =>{ 
          try {
            await Auth.signOut();
            props.screenProps.handler("auth")
          } catch (error) {
            console.log('error signing out: ', error); 
          }
          
        }} />
      </SafeAreaView>
    </View>
),
drawerOpenRoute: 'DrawerOpen',
drawerCloseRoute: 'DrawerClose',
drawerToggleRoute: 'DrawerToggle'
})

export default createAppContainer(RootDrawerNavigator)