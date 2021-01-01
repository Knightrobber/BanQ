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
} from 'react-native';

import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import database from '@react-native-firebase/database';

export default class Menu extends Component {

	renderSeparator = () => {
		return (
			<View
				style={{
					height: 1,
					width: "100%",
					backgroundColor: "#000",
				}}
			/>
		);
	};
	//handling onPress action  
	getListViewItem = (item) => {
		Alert.alert(item.key);
	}

	constructor() {
		super()
		this.state = {
			Id: 'rt347',
			partitions: [],
			partitionNames: [],
			TotalBudget: 0,
			SpentCash: 0,
			crap: 0,
			textInput: '',
			toggle: false,
			itemName: '',
			itemPrice: 0,
			shopName: '',
			itemPartition: '',
			addItemName: '',
			addItemPrice: 0,
			shopNames: [],
			shopPartitions: [],
			todayDate: null,
			todaySpentCash: 0,
			toggleAddButton: false,
			newItemName: '',
			newItemPrice: 0,

		}
	}
	async componentDidMount() {
		await auth().onAuthStateChanged(async (user) => {
			// if (!user)
			// 	console.log("error has occured in authstatechanged ");
			// if (user) {
			// 	console.log("The is the user " + user);
			// 	let userName = user.email;
			// 	userName = userName.split("@")
			// 	if (userName[0].includes('.'))
			// 		userName[0] = userName[0].replace(/[.]/g, "+");
			// 	let Id = userName[0];
			// 	console.log(Id);


			// }
			//let Id = "rt347"
			//console.log(Id);
			console.log("In auth chnage")
			await this.setState({
				Id: 'rt347'
			})

		})
		let TotalBudget = 0

		await database().ref("Budget/" + this.state.Id).once('value', snap => {
			let TotalBudget = snap.val().TotalBudget.Total
			let SpentCash = snap.val().SpentCash.Cash
			let partitions = []
			let todayDate = new Date(snap.val().Today.Date);
			let todaySpentCash = snap.val().Today.SpentCash;
			if (snap.child("Partitions").val() != null) {
				snap.child("Partitions").forEach(subSnap => {
					let tempObject = new Object()
					tempObject.Name = subSnap.val().Name
					console.log(typeof (subSnap.val().TotalBudget), "Mounting")
					tempObject.TotalBudget = subSnap.val().TotalBudget
					tempObject.SpentCash = subSnap.val().SpentCash
					tempObject.TotalBudgetEdit = false
					tempObject.budgetChangeFlag = false
					tempObject.TotalBudgetPrev = subSnap.val().TotalBudget
					partitions.push(tempObject)

				})
			}

			this.setState({
				partitions: partitions,
				TotalBudget: TotalBudget,
				SpentCash: SpentCash,
				todayDate,
				todaySpentCash
			})
		})



		database().ref("Budget/" + this.state.Id + "/TotalBudget").on('value', snap => {
			console.log("TOtoalbudget chaange triggered")
			let TotalBudget = snap.val().Total
			this.setState({
				TotalBudget: snap.val().Total
			})

			database().ref("Budget/" + this.state.Id + "/Partitions").once('value', snap => {
				console.log("Partition inside Total budget")
				let partitionsNamesLocal = []
				if (snap.val() == null) {
					this.setState(state => {
						let partitionNames = []
						partitionNames.push("Main")
						return {
							partitionNames
						}
					})
				}
				else {
					let partitionsTotal = 0
					snap.forEach(subSnap => {
						partitionsNamesLocal.push(subSnap.key)
						partitionsTotal += subSnap.val().TotalBudget
					})
					if (partitionsTotal < TotalBudget) {
						partitionsNamesLocal.unshift("Main")
					}
					console.log(partitionsNamesLocal, "names 1")
					this.setState({
						partitionNames: partitionsNamesLocal
					})
					console.log("\nnames 1")

				}

			})

		})



		database().ref("Budget/" + this.state.Id + "/Partitions").on('value', snap => {
			console.log("PArtition chnaged")
			let TotalBudget = this.state.TotalBudget
			let partitionsNamesLocal = []
			let subSnapCount = 0;
			if (snap.val() == null) {
				this.setState(state => {
					let partitionNames = []
					partitionNames.push("Main")
					return {
						partitionNames
					}
				})
			}
			else {
				let partitionsTotal = 0
				snap.forEach(subSnap => {
					++subSnapCount;
					partitionsNamesLocal.push(subSnap.key)
					partitionsTotal += subSnap.val().TotalBudget
				})

				if (partitionsTotal < TotalBudget) {
					partitionsNamesLocal.unshift("Main")
				}
				this.setState({
					partitionNames: partitionsNamesLocal
				})
				console.log(partitionsNamesLocal, "names 2")
				console.log(subSnapCount, "No of children")

			}

		})

		database().ref("Budget/" + this.state.Id + "/Today").on('value', snap => {

			let tempDate = new Date(snap.val().Date)
			console.log(tempDate, "val of tempdate", tempDate.getDate(), "hey")
			if (tempDate.getDate() < new Date().getDate()) {
				console.log("true")
				tempDate = new Date()
				this.setState({
					todaySpentCash: 0,
					todayDate: tempDate
				})
			}
		})
		database().ref("/Items").on('value', (snapshot) => {
			var shops = []
			var snPartitions = []
			snapshot.forEach((child) => {
				shops.push(child.key);
				let temp = new Object()
				temp.storeName = child.key
				temp.pickerValue = 'A'

				if (snapshot.hasChild(child.key)) {
					var shopname = child.key;
					var li = [];
					snapshot.child(shopname).forEach((child) => {
						li.push({
							name: child.key,
							price: child.val(),
						})
					})
					temp.shopItemsList = li
				}
				snPartitions.push(temp)


			})
			this.setState({ shopNames: shops, shopPartitions: snPartitions })

		})
	}
	logout = () => {
		auth()
			.signOut()
			.then(() => {
				console.log('User signed out!')
				this.props.navigation.navigate("Auth")
			});
	}

	checkInput = () => {
		let val = this.state.textInput
		if (!isNaN(val) && !isNaN(parseFloat(val))) {
			val = parseInt(val)
			console.log(typeof (val), val)
		}
		else {
			console.log("Not a num")
		}


	}


	spendMoney = (boughtItem, boughtItemPrice, storeName, boughtItemPartition) => {
		var today = new Date();
		var date = today.getDate() + "-" + parseInt(today.getMonth() + 1) + "-" + today.getFullYear();
		console.log(date);
		console.log(typeof (date));
		//console.log(boughtItemPartition,"Name of partition")
		let index = this.findPartitionIndex(boughtItemPartition)
		//console.log(index,"index after function")
		this.setState(state => {
			let SpentCash = state.SpentCash + boughtItemPrice
			let partitions = state.partitions;
			let todaySpentCash = state.todaySpentCash + boughtItemPrice;
			//console.log(partitions)
			console.log(index, "index")

			if (index == -1) {
				console.log(SpentCash, "From menu")
				database().ref("Budget/" + this.state.Id + "/SpentCash").set({
					Cash: SpentCash
				})

			}
			else {
				console.log(SpentCash, "From menu")
				database().ref("Budget/" + this.state.Id + "/SpentCash").set({
					Cash: SpentCash
				})


				partitions[index].SpentCash = partitions[index].SpentCash + boughtItemPrice
				database().ref("Budget/" + this.state.Id + "/Partitions/" + boughtItemPartition).set({
					Name: partitions[index].Name,
					SpentCash: partitions[index].SpentCash,
					TotalBudget: partitions[index].TotalBudget
				})
			}
			database().ref("Budget/" + this.state.Id + "/Today").set({
				Date: this.state.todayDate.getTime(),
				SpentCash: todaySpentCash
			})
			//console.log(partitions[index].SpentCash) //soemthing wrong here
			//partitions[index].SpentCash = partitions[index].SpentCash + boughtItemPrice
			/* database().ref("Budget/" +this.state.Id + "/SpentCash").set({
				Cash:SpentCash
			})
			database().ref("Budget/" + this.state.Id + "/Partitions/" + boughtItemPartition).set({
				Name:partitions[index].Name,
				SpentCash: partitions[index].SpentCash,
				TotalBudget:partitions[index].TotalBudget
			}) */
			return {
				partitions,
				SpentCash,
				todaySpentCash
			}
		})

		database().ref("Transactions/" + this.state.Id + "/" + date).push({
			shopName: storeName,
			itemName: boughtItem,
			itemPrice: boughtItemPrice,
			itemPartition: boughtItemPartition,

		})
	}

	toggleAddButtonFunc = () => {
		console.log("New Item Being added");
		console.log(this.state.toggleAddButton);
		this.setState({
			toggleAddButton: !this.state.toggleAddButton
		})

	}

	saveChangesAddItem = () => {
		console.log("Save button pressed boi")
	}

	showNewItem = () => {
		// console.log("Entering show new item")
		if (this.state.toggleAddButton) {
			return (
				<View style={{ backgroundColor: 'green' }}>
					<View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
						<Text>Item Name</Text>
						<TextInput placeholder='enter here' onChangeText={(input) => { this.setState({ newItemName: input }) }} style={{ width: 50, color: 'red' }} />
					</View>
					<View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
						<Text>Item Price</Text>
						<TextInput placeholder='enter here' onChangeText={(input) => { this.setState({ newItemPrice: input }) }} />
					</View>
					<Button title="save changes" onPress={() => { this.saveChangesAddItem() }}></Button>
				</View>
			)
		}

	}

	displayShopInfo = () => {
		// console.log("NEW BITCH")
		return this.state.shopNames.map((name, index) => {
			let shopName = name.toString()
			let temp = new Object()
			// console.log(shopName)
			return this.state.shopPartitions.map((store_details, index) => {
				if (shopName.localeCompare(store_details.storeName) == 0 && shopName.localeCompare("Your Custom") != 0) {
					temp = store_details
					// console.log("inside if")
					// console.log(temp.shopItemsList)
					return (
						<View>
							<View style={{ flexDirection: 'row' }}>
								<Text>{shopName.toUpperCase()}</Text>
								<Picker
									selectedValue={temp.pickerValue}
									style={{ height: 50, width: 150 }}
									onValueChange={(itemValue, itemIndex) => {
										temp.pickerValue = itemValue
										this.setState((state) => {
											let snPartitions = state.shopPartitions
											snPartitions[index].pickerValue = itemValue
											return {
												snPartitions
											}
										})
									}}>
									{/* <Picker.Item label="Partition A" value="A" />
									<Picker.Item label="Partition B" value="B" /> */}
									{this.createPickerDropdown()}
								</Picker>
							</View>
							<View style={{ flexDirection: 'row' }}>
								<View style={{ flexDirection: 'column' }}>
									{
										<FlatList style={{ width: '100%' }}
											data={temp.shopItemsList}
											renderItem={({ item }) => {
												return (
													<View style={{ flexDirection: 'row' }}>
														<Text>{item.name} {" :  Rs."} {item.price} </Text>
														<TouchableOpacity style={styles.button} onPress={() => { this.spendMoney(item.name, item.price, shopName, temp.pickerValue) }}>
															<Text>  >  </Text>
														</TouchableOpacity>
													</View>)
											}} />

									}
								</View>
							</View>
						</View>
					)
				}
				else
					return null
			})
		}
		)
	}

	findPartitionIndex = (partitionName) => {
		let partitions = this.state.partitions;
		let elementIndex = -1
		//console.log(partitions,"All partitions")
		partitions.map((item, index) => {
			//console.log(item.Name,partitionName,"From function")

			if (item.Name === partitionName) {

				//console.log(index,"Index from function")
				elementIndex = index
			}
		})
		return elementIndex
	}

	createPickerDropdown = () => {
		// console.log("picker called")
		let names = this.state.partitionNames
		// console.log(names, "shop names")
		let pickers = []
		names.map((item, index) => {
			pickers.push(<Picker.Item label={item} value={item} />)

		})
		return (
			pickers

		);
	}

	render() {

		return (
			<ScrollView>
				<View style={styles.container}>
					<Text>Menu</Text>
				</View>
				<View>
					{this.displayShopInfo()}
					<Button title="Add" onPress={() => { this.toggleAddButtonFunc() }} />
					{this.showNewItem()}
				</View>

				<Button title="Logout" onPress={() => { this.logout() }} />

			</ScrollView>
		);
	}
}


const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#fff',
		alignItems: 'center',
		justifyContent: 'center',
	},
	input: {
		borderWidth: 1,
		borderColor: '#777',
		padding: 8,
		margin: 10,
		width: 200,
	},
	button: {
		justifyContent: 'center',
		textAlign: 'center',
		width: 25,
		backgroundColor: 'green',
		borderRadius: 10,
		margin: 20,
		//position: 'absolute',
		//right: 0,
	},
});