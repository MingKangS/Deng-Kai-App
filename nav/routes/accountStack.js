import React, {Component} from 'react';
import { createStackNavigator } from 'react-navigation-stack';
import Header from '../shared/header';
import Account from '../screens/Account';
import ChangeCredentials from '../screens/changeCredentials';
import Users from '../screens/users';
import Sign from '../../login/signUp';

const screens = {
    Account: {
        screen: Account,
        navigationOptions: ({ navigation }) => {
            return {
            headerTitle: () => <Header title='Account' navigation={navigation} />
            }
        },
    },
    Change_Credentials: {
        screen: ChangeCredentials,
    
    },
};

const AccountStack = createStackNavigator(screens);

export default AccountStack;