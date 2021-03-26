import React, {Component} from 'react';
import { createStackNavigator } from 'react-navigation-stack';
import Header from '../shared/header';
import About from '../screens/about';

const screens = {
    About: {
        screen: About,
        navigationOptions: ({ navigation }) => {
            return {
            headerTitle: () => <Header title='About' navigation={navigation} />
            }
        },
    },
};

const AboutStack = createStackNavigator(screens);

export default AboutStack;
