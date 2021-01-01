/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React,{Component,useState,useEffect} from 'react';
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

import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import messaging from '@react-native-firebase/messaging';
import firebase from '@react-native-firebase/app';
import AsyncStorage from '@react-native-community/async-storage';



const Tab = createBottomTabNavigator();
/*   export default class App extends Component{
   
 
    render(){
      
      return(
      <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen name="Menu" component={Menu} />
        <Tab.Screen name="Split" component={Split} />
      </Tab.Navigator>
    </NavigationContainer>
    );
    }
  } */
  async function requestUserPermission() {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;
  
    if (enabled) {
      console.log('Authorization status:', authStatus);
    }
  }

  export default function App(){
    const [count,setCount] = useState(0);
    useEffect( ()=>{
      async function requestUser(){
        await requestUserPermission()
        console.log("Hey")
      
      }
      async function getToken(){
        await messaging().registerDeviceForRemoteMessages();
        const token = await messaging().getToken()
        console.log(token)
        return token;
        
       /*  let token = await AsyncStorage.getItem('fcmToken')
        if(token==null){
          token = await messaging().getToken()
          console.log("Token null")
          if(token){
            await AsyncStorage.setItem('fcmToken',token);
            return token;
          }
        }
        else{
          console.log("Token not null")
          return token;
        } */
      }
      requestUser().then(()=>{
       let token = getToken()
        console.log(token," Token")
   
      
      const unsubscribe = messaging().onMessage(async remoteMessage => {
        Alert.alert('A new FCM message arrived!', JSON.stringify(remoteMessage));
        console.log("New message")
      });
  
      return unsubscribe;
    })
 })

    return(
      <View>
        <Text>Hey!</Text>
        <Button onPress={()=>{setCount(count+1)}} title="Press"></Button>
        <Text>{count}</Text>
      </View>
    );
 
}



  