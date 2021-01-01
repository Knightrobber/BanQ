/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, { Component, useState, useEffect } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
  Button,
  TextInput,
  Alert
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import Login from './Tabs/Login/Login.js'
import Menu from './Tabs/Menu.js'
import Split from './Tabs/Split.js'
import Wallet from './Tabs/Wallet.js'
import Register from './Tabs/Login/Register.js'
import Profile from './Tabs/Profile.js';

import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import messaging from '@react-native-firebase/messaging';
import firebase from '@react-native-firebase/app';
import AsyncStorage from '@react-native-community/async-storage';


const Stack = createStackNavigator();
const Tabs = createBottomTabNavigator();
const Drawer = createDrawerNavigator();
export default class App extends Component {

  createHomeStack = () => {
    return (
      <Stack.Navigator>
        <Stack.Screen name="Auth" children={this.createDrawer} options={{ title: "Auth", headerShown: false }} />
        <Stack.Screen name="BanQ" children={this.createTabs} options={{ headerShown: false }} />
      </Stack.Navigator>
    );
  }
  createTabs = () => {
    return (
      <Tabs.Navigator tabBarOptions={{ style: { backgroundColor: '#096348' }, labelStyle: { fontSize: 20, fontFamily: 'Oxygen' } }}>
        <Tabs.Screen name="Wallet" component={Wallet} />
        <Tabs.Screen name="Menu" component={Menu} />
        <Tabs.Screen name="Split" component={Split} />
        <Tabs.Screen name="Profile" component={Profile} />

      </Tabs.Navigator>
    );
  }
  createDrawer = () => {
    return (
      <Drawer.Navigator>
        <Drawer.Screen name="Login" component={Login} options={{ title: "Login" }} />
        <Drawer.Screen name="Register" component={Register} options={{ title: "Register" }} />

      </Drawer.Navigator>
    )
  }

  render() {

    return (
      <NavigationContainer>
        {this.createHomeStack()}
      </NavigationContainer>
    );
  }
}