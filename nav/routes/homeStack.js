import React, {Component} from 'react';
import { createStackNavigator } from 'react-navigation-stack';
import Header from '../shared/header';
import Nav from '../screens/home';

const screens = {
    Home: {
        screen: Nav,
        navigationOptions: ({ navigation }) => {
            return {
            headerTitle: () => <Header title='Home' navigation={navigation} />
            }
        },
    },
};

const HomeStack = createStackNavigator(screens);

export default HomeStack;