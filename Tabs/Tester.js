import database from '@react-native-firebase/database';
import React, { Component } from 'react';
import { useState } from 'react';
import {
	SafeAreaView,
	StyleSheet,
	ScrollView,
	View,
	Text,
	StatusBar,
	Button,
	TextInput,
	FlatList,
	Alert,
	TouchableOpacity,
	Picker,
	Modal,
	ImageBackground,
	Image
} from 'react-native';


export default class Tester extends Component{


	componentDidMount(){

	
	}




	verifyBuyDate = (stringDate)=>{
	/* 	let comps = stringDate.split('-');
		let date = parseInt(comps[0])
		let month = parseInt(comps[1])
		let year = parseInt(comps[2])
		//console.log(date,month,year)
		let temp = new Date()
		//console.log(temp.getDate()==date)
		if(temp.getDate()==date && temp.getMonth()+1==month && temp.getFullYear()==year){
			return true;
		}
		else	
			return false; */
			let key=[];
			let date = "9-12-2020"
		database().ref("Transactions/mark22"+ "/" + date).once('value',snap=>{
			snap.forEach(subSnap=>{
				key.push(subSnap.key);
			})
			console.log(key);
		})

	}

	constructor(){
		super();
		this.state={
			moi:0
		}

	}
	render(){
		return(
			<View>
				<Text>Hey</Text>
				<Button title="press" onPress={()=>{
					let date = "10-12-2020";
					this.verifyBuyDate()
				}}></Button>
			</View>
		);
	}
}