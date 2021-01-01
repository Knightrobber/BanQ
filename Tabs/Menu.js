
//contains integrated menu

import React, { Component } from 'react';
import { useState } from 'react';
import {
	SafeAreaView,
	StyleSheet,
	ScrollView,
	View,
	//Text,
	StatusBar,
	//Button,
	TextInput,
	FlatList,
	Alert,
	TouchableOpacity,
	Picker,
	Modal,
	ImageBackground,
	Image
} from 'react-native';

import {
	Container,
	Header,
	Content,
	Card,
	CardItem,
	Body,
	Text,
	Grid,
	Col,
	Row,
	Left,
	Thumbnail,
	Button,
	Icon,
	Right,
	Item,
} from 'native-base';

import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import database from '@react-native-firebase/database';
import { TouchableHighlight } from 'react-native-gesture-handler';

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
			Id: '',
			partitions: [],
			partitionNames: [],
			TotalPartitionInfo: [],
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
			modalVisible: false,
			customList: [],
			customPicker: '',
			spendMoneyFlag:0

		}
	}
	async componentDidMount() {
		await auth().onAuthStateChanged(async (user) => {
			if (!user)
				console.log("error has occured in authstatechanged ");
			if (user) {
				console.log("The is the user " + user);
				let userName = user.email;
				userName = userName.split("@")
				if (userName[0].includes('.'))
					userName[0] = userName[0].replace(/[.]/g, "+");
				let Id = userName[0];
				console.log(Id);
				await this.setState({
					Id: Id
				})

			}
			//let Id = "rt347"
			//console.log(Id);
			console.log("In auth chnage")

		})
		let TotalBudget = 0

		await database().ref("Budget/" + this.state.Id).once('value', async (snap) => {
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

			await this.setState({
				partitions: partitions,
				TotalBudget: TotalBudget,
				SpentCash: SpentCash,
				todayDate,
				todaySpentCash
			})
		})



		database().ref("Budget/" + this.state.Id + "/TotalBudget").on('value', snap => {
			//console.log("TOtoalbudget chaange triggered")
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
					//console.log(partitionsNamesLocal, "names 1")
					this.setState({
						partitionNames: partitionsNamesLocal
					})
					//console.log("\nnames 1")

				}

			})

		})
		database().ref("Budget/" + this.state.Id + "/SpentCash").on('value', snap => {
			this.setState({
				SpentCash: snap.val().Cash
			})
		})


		database().ref("Budget/" + this.state.Id + "/Partitions").on('value', snap => {
			if (snap.val() != null) {
				let partitions = [];
				snap.forEach(subSnap => {
					let tempObject = new Object()
					tempObject.Name = subSnap.val().Name
					//console.log(typeof(subSnap.val().TotalBudget),"Mounting")
					//console.log(subSnap.val().TotalBudget, subSnap.val().Name)
					tempObject.TotalBudget = subSnap.val().TotalBudget
					tempObject.SpentCash = subSnap.val().SpentCash
					tempObject.TotalBudgetEdit = false
					tempObject.budgetChangeFlag = false
					tempObject.TotalBudgetPrev = subSnap.val().TotalBudget
					partitions.push(tempObject)
				})
				this.setState({ partitions: partitions }, () => {
					console.log("Partition chnage will reflect now")

				});
				//console.log("PArtition chnaged")
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
					//console.log(partitionsNamesLocal,"names 2")
					//console.log(subSnapCount,"No of children")

				}
			}

		})

		database().ref("Budget/" + this.state.Id + "/Today").on('value', snap => {
			this.setState({
				todaySpentCash:snap.val().SpentCash
			})
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
		database().ref("/Custom\ Items/" + this.state.Id).on('value', (snapshot) => {
			var customli = [];
			snapshot.forEach((child) => {
				console.log(child.val())
				customli.push({
					name: child.val().itemName,
					price: child.val().itemPrice,
				})
				this.setState({ customList: customli });
				console.log(this.state.customList);
			})
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



	spendMoney = (boughtItem, boughtItemPrice, storeName, boughtItemPartition) => {
		//let spendMoneyFLag = this.state.spendMoneyFlag;
		
			/* spendMoneyFLag=1;
			this.setState({
				spendMoneyFLag:1
			}) */

		console.log(boughtItemPartition, "PArtitionnnnn");
		console.log(typeof(boughtItemPrice),"TYpeeee")
		boughtItemPrice = parseInt(boughtItemPrice)
		if (boughtItemPartition == "A")
			boughtItemPartition = "Main"
		var today = new Date();
		var date = today.getDate() + "-" + parseInt(today.getMonth() + 1) + "-" + today.getFullYear();
		//console.log(date);
		//console.log(typeof (date));
		//console.log(boughtItemPartition,"Name of partition")
		let index = this.findPartitionIndex(boughtItemPartition)
		let canBuy = this.canBuy(boughtItemPrice, index);
		//console.log(index,"index after function")
		if (canBuy) {
			this.setState(state => {
				console.log("SpentCash before buying from menu",state.SpentCash)
				console.log(this.state.spendMoneyFlag)
				let SpentCash = state.SpentCash + boughtItemPrice
				console.log("SpentCash after buying from menu",SpentCash)
				let partitions = state.partitions;
				let todaySpentCash = state.todaySpentCash + boughtItemPrice;
				console.log(!partitions,!todaySpentCash,!SpentCash)
				
				//console.log(partitions)
				//console.log(index,"index")

				if (index == -1) {
					console.log("Setting main partition")
					//console.log(SpentCash,"From menu")
					database().ref("Budget/" + this.state.Id + "/SpentCash").set({
						Cash: SpentCash
					})

				}
				else {
					//console.log(SpentCash,"From menu")
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
				console.log("setting today")
				database().ref("Budget/" + this.state.Id + "/Today").set({
					Date: this.state.todayDate.getTime(),
					SpentCash: todaySpentCash
				})

				console.log("setting transactions")

				database().ref("Transactions/" + this.state.Id + "/" + date).push({
					shopName: storeName,
					itemName: boughtItem,
					itemPrice: boughtItemPrice,
					itemPartition: boughtItemPartition,
		
				})
				return {
					partitions,
					SpentCash,
					todaySpentCash
				}
			})
		}
		else {
			/* this.setState({
				spendMoneyFlag:0
			}) */
			if (index != -1) {
				Alert.alert("Not enough cash in ", this.state.partitions[index].Name)
			}

			else
				alert("Not enough cash in Main");
		}
	}
	canBuy = (price, index) => {
		if (index != -1) {
			let budget = this.state.partitions[index].TotalBudget;
			let spent = this.state.partitions[index].SpentCash;
			console.log(index)
			console.log(this.state.partitions[index].Name, spent, "Budget", this.state.partitions[index].TotalBudget)
			console.log(this.state.partitions[index].Name, spent + price, "if spent");
			if (spent + price > budget)
				return false;
			else
				return true;
		}
		else {
			let budget = 0;
			let spent = 0;
			let spentParti = 0;
			for (let i = 0; i < this.state.partitions.length; ++i) {
				budget += this.state.partitions[i].TotalBudget;
				spentParti += this.state.partitions[i].SpentCash;

			}
			console.log("main", this.state.TotalBudget - budget)
			console.log(this.state.SpentCash)
			spent = this.state.SpentCash - spentParti;
			console.log(spent);
			if (spent + price > this.state.TotalBudget - budget)
				return false;
			else {
				console.log(spent + price);
				return true;
			}

		}

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
		let name = this.state.newItemName;
		let amount = this.state.newItemPrice;
		if(name!='' && !isNaN(amount)){
			if(parseInt(amount)>0){
				database().ref("Custom\ Items/" + this.state.Id + "/").push({
					itemName: this.state.newItemName,
					itemPrice: this.state.newItemPrice,
				})
				this.setState({
					toggleAddButton: false,
					newItemName: '',
					newItemPrice: 0
				})
			}
			else
       			alert("Please enter a number greater than 0")
		}
		else{
			alert("Details haven't been entered correctly")
		  }
		
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
	displayCustomItemInfo = () => {
		console.log("NEW BITCH")
		let temp = new Object()
		//console.log(shopName)
		//if (shopName.localeCompare(store_details.storeName) == 0 && shopName.localeCompare("Your Custom") != 0) {
		temp = this.state.customList
		console.log(temp)
		// console.log(temp.shopItemsList)
		return (
			<Grid style={{ marginTop: 0, paddingBottom: 30 }}>
				<Row>
					<Body>
						<Text style={styles.rightText}>{"YOUR CUSTOM"}</Text>
					</Body>
				</Row>
				<Row style={{ marginTop: 0, paddingBottom: 0 }}>
					{/* <Picker style={{ height: 50, width: 150 }} >
									<Picker.Item label="Mahesh" value="key0" />
									<Picker.Item  label="Adarsh" value="key1" />
									<Picker.Item  label="Naveen" value="key2" />
									<Picker.Item  label="Vendiman" value="key3" />
								</Picker> */}
					<Picker style={{ height: 50, width: 150 }}
						selectedValue={temp.pickerValue}
						onValueChange={(itemValue, itemIndex) => {
							temp.pickerValue = itemValue
							console.log(temp.pickerValue);
							this.setState({ customPicker: temp.pickerValue })
						}}
					>
						{this.createPickerDropdown()}
					</Picker>
				</Row>

				<FlatList style={{ width: '100%' }}
					data={temp}
					renderItem={({ item }) => {
						return (
							<Row>
								<Col size={3}>
									<Body>
										<Text style={styles.rightTextSmall}>{item.name} {" :  Rs."} {item.price}</Text>
									</Body>
								</Col>
								{/* <Text>Hey</Text> */}
								<Col size={1}>
									<Body
										style={{
											textAlign: 'left',
											padding: 0,
											height: 10,
											width: 300,
											borderRadius: 20,
										}}>
										<TouchableHighlight onPress={() => { this.spendMoney(item.name, item.price, "Your Custom", this.state.customPicker) }}>
											<Icon
												type="FontAwesome"
												name="arrow-circle-o-right"
												style={{ fontSize: 15, color: 'black' }}
											/>
										</TouchableHighlight>
									</Body>
								</Col>
							</Row>

						)
					}} />



			</Grid>
		)
		//	}
		// else
		// 	return null

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

						<Grid style={{ marginTop: 0, paddingBottom: 30 }}>
							{console.log("Hey from flatlist")}
							<Row>
								<Body>
									<Text style={styles.rightText}>{shopName.toUpperCase()}</Text>
								</Body>
							</Row>
							<Row style={{ marginTop: 0, paddingBottom: 0 }}>
								{/* <Picker style={{ height: 50, width: 150 }} >
									<Picker.Item label="Mahesh" value="key0" />
									<Picker.Item  label="Adarsh" value="key1" />
									<Picker.Item  label="Naveen" value="key2" />
									<Picker.Item  label="Vendiman" value="key3" />
								</Picker> */}
								<Picker style={{ height: 50, width: 150 }}
									selectedValue={temp.pickerValue}
									onValueChange={(itemValue, itemIndex) => {
										temp.pickerValue = itemValue
										this.setState((state) => {
											let snPartitions = state.shopPartitions
											snPartitions[index].pickerValue = itemValue
											return {
												snPartitions
											}
										})
									}}
								>
									{this.createPickerDropdown()}
								</Picker>
							</Row>

							<FlatList style={{ width: '100%' }}
								data={temp.shopItemsList}
								renderItem={({ item }) => {
									return (
										<Row>
											<Col size={3}>
												<Body>
													<Text style={styles.rightTextSmall}>{item.name} {" :  Rs."} {item.price}</Text>
												</Body>
											</Col>
											<Col size={1}>
												<Body
													style={{
														textAlign: 'left',
														padding: 0,
														height: 10,
														width: 300,
														borderRadius: 20,
													}}>
													<TouchableHighlight onPress={() => { this.spendMoney(item.name, item.price, shopName, temp.pickerValue) }}>
														<Icon
															type="FontAwesome"
															name="arrow-circle-o-right"
															style={{ fontSize: 15, color: 'black' }}
														/>
													</TouchableHighlight>
												</Body>
											</Col>
										</Row>

									)
								}} />



						</Grid>
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
	setModalVisible = visible => {
		this.setState({ modalVisible: visible });
	};
	render() {

		return (
			<View style={{ backgroundColor: 'white' }}>
				<ImageBackground
					style={styles.imgBackground}
					imageStyle={styles.imgBG}
					source={require('../assets/bg.png')}>
					<Image
						source={require('../assets/logo.png')}
						style={styles.logoStyle}
					/>
					<CardItem style={styles.logocard}>
						<Image
							source={require('../assets/banqLogo.png')}
							style={{
								width: '90%',
								resizeMode: 'contain',
								margin: 10,
							}}
						/>
					</CardItem>

					<Card
						style={{
							alignSelf: 'center',
							padding: 20,
							height: '62.5%',
							width: 350,
							borderRadius: 20,
						}}>
						{/* <Grid>
              <Text style={styles.largeText}>Shops</Text>
            </Grid> */}
						<ScrollView>
							{this.displayShopInfo()}
							{this.displayCustomItemInfo()}

							<Grid style={{ marginTop: 0, marginBottom: 0, paddingBottom: 0 }}>
								<Row>
									<Col>
										<Button
											onPress={() => {
												this.setModalVisible(true);
											}}
											style={styles.buttonStyle}>
											<Text style={styles.buttonTextStyle}>Add</Text>
										</Button>
									</Col>
									{/* <Col>
										<Button
											onPress={() => {
												this.props.navigation.navigate('Home');
											}}
											style={styles.buttonStyle}>
											<Text style={styles.buttonTextStyle}>Save Changes</Text>
										</Button>
									</Col> */}
								</Row>
							</Grid>
						</ScrollView>
					</Card>

					<Modal
						animationType="slide"
						transparent={false}
						visible={this.state.modalVisible}
						statusBarTranslucent={true}>
						<View style={styles.centeredView}>
							<View style={styles.modalView}>
								<Text
									style={{
										fontSize: 30,
										textAlign: 'center',
										fontWeight: 'bold',
									}}>
									Add Item
                </Text>

								<TextInput
									style={styles.TextInput}
									placeholder="Item Name"
									onChangeText={(input) => { this.setState({ newItemName: input }) }}
								//onChangeText={value => this.setState({name: value})}
								/>
								<TextInput
									style={styles.TextInput}
									keyboardType="number-pad"
									placeholder="Item Price"
									onChangeText={(input) => { this.setState({ newItemPrice: input }) }}
								//onChangeText={value => this.setState({number: value})}
								/>

								<Button
									title="Cancel"
									onPress={() => {
										this.saveChangesAddItem()
										this.setModalVisible(false);
									}}
									style={styles.buttonStyleModal}>
									<Text style={styles.buttonTextStyle}>Save Item</Text>
								</Button>
							</View>
						</View>
					</Modal>
				</ImageBackground>
			</View>
		);
	}
}


/* const styles = StyleSheet.create({
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
 */
const styles = StyleSheet.create({
	imgBackground: {
		width: '100%',
		height: '100%',
		resizeMode: 'contain',
	},
	imgBG: {
		borderBottomLeftRadius: 25,
		borderBottomRightRadius: 25,
	},
	logoStyle: {
		width: 40,
		height: 51,
		resizeMode: 'contain',
		justifyContent: 'flex-start',
		padding: 25,
		margin: 10,
	},
	nameCard: { textAlign: 'center', padding: 20 },
	cardItemStyle: { backgroundColor: 'transparent' },
	largeTextHead: {
		color: 'black',
		fontFamily: 'Oxygen-Bold',
		fontSize: 30,
		textAlign: 'center',
	},
	largeText: {
		color: 'black',
		fontFamily: 'Oxygen-Bold',
		fontSize: 20,
	},
	logocard: {
		width: '100%',
		alignSelf: 'center',
		justifyContent: 'center',
		marginTop: 20,
		backgroundColor: 'transparent',
	},
	smallTextHead: {
		color: 'black',
		fontSize: 20,
		fontFamily: 'Oxygen-Regular',
	},
	smallTextHead: {
		color: 'black',
		fontSize: 15,
		fontFamily: 'Oxygen-Regular',
	},
	rightText: {
		color: 'black',
		fontFamily: 'Oxygen-Bold',
		fontSize: 20,
		fontWeight: '700',
	},
	rightTextSmall: {
		color: 'black',
		fontFamily: 'Oxygen-Regular',
		fontSize: 15,
	},
	buttonStyle: {
		borderRadius: 20,
		width: '40%',
		justifyContent: 'center',
		backgroundColor: '#EA5656',
		marginTop: 0,
		alignSelf: 'center',
	},
	buttonTextStyle: {
		fontSize: 16,
		fontFamily: 'Oxygen-Bold',
		fontWeight: 'bold',
		color: 'white',
		textAlign: 'center',
		padding: 1,
	},

	title: {
		color: 'purple',
		textAlign: 'center',
		fontWeight: '900',
		fontSize: 50,
	},
	Box: {
		margin: 5,
		padding: 25,
		borderWidth: 2,
		borderRadius: 25,
	},
	name: {
		fontWeight: 'bold',
		color: 'black',
		fontSize: 30,
		marginRight: 50,
	},
	profession: {
		fontSize: 15,
		fontWeight: '200',
		padding: 10,
	},
	number: {
		fontSize: 20,
		fontWeight: '200',
	},
	centeredView: {
		justifyContent: 'center',
		alignSelf: 'center',
		width: '85%',
		height: '50%',
	},
	modalView: {
		borderWidth: 2,
		padding: 15,
		borderRadius: 25,
	},
	TextInput: {
		fontSize: 20,
		fontWeight: '200',
		borderBottomWidth: 1,
		paddingTop: 30,
	},

	buttonStyleModal: {
		borderRadius: 20,
		width: '98%',
		justifyContent: 'center',
		backgroundColor: '#EA5656',
		marginTop: 30,
		marginBottom: 20,
		paddingTop: 0,
	},
});