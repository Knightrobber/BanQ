import React, {Component} from 'react';
import {
  View,
  Text,
  ImageBackground,
  Image,
  TextInput,
  StyleSheet,
  Alert,
  ScrollView
} from 'react-native';
import {Button, CardItem, Body} from 'native-base';
import auth from '@react-native-firebase/auth';
import database from '@react-native-firebase/database';

export default class Register extends Component {
  constructor(props) {
    super(props);
    this.state = {
      displayName: '',
      email: '',
      password: '',
      confirmPassword: '',
      name: '',
      phoneNo: null,
    };
  }

  register = () => {
    let email = this.state.email;
    let password = this.state.password;
    let name = this.state.name;
    let phoneNo = this.state.phoneNo;
    console.log(email + ' ' + password);
    
    if(email!='' && password!='' && name!='' && phoneNo!=null ){

      if(phoneNo.length==10 && !isNaN(phoneNo)){
            console.log("its g")
            
           /*  database().ref("Users/temp").push({
              Name:"mark21",
              Email:"mark21@snu.edu.in",
              PhoneNo:1234567890
            }).then(()=>{
              console.log("pushed")
            }) */
						auth()
						.createUserWithEmailAndPassword(email, password)
						.then(async() => {
						   await this.makeDB()
						   console.log("DB created")
						  console.log('User account created & signed in!');
						  this.props.navigation.navigate("BanQ")
						})
						.catch(error => {
						  if (error.code === 'auth/email-already-in-use') {
							console.log('That email address is already in use!');
						  }
					  
						  if (error.code === 'auth/invalid-email') {
							console.log('That email address is invalid!');
						  }
					  
						  console.error(error);
            });
          }
        else{
          alert("Wrong phone No entered")
        }

					}
					else{
						Alert.alert("One of the fields wrongly entered or not entered");
					}
  };

  async makeDB() {
    let userName = this.state.email;
    let createdDate = new Date();
    userName = userName.split('@');
    if (userName[0].includes('.'))
      userName[0] = userName[0].replace(/[.]/g, '+');
    let Id = userName[0];
    await database()
      .ref('/Budget/' + Id + '/TotalBudget/')
      .set({
        Total: 0,
      });
    await database()
      .ref('/Budget/' + Id + '/SpentCash/')
      .set({
        Cash: 0,
      });
    let startDate = new Date().getTime();
    await database()
      .ref('/Budget/' + Id + '/DaySet/')
      .set({
        Date: startDate,
      });
    await database()
      .ref('/Budget/' + Id + '/Today')
      .set({
        SpentCash: 0,
        Date: new Date().getTime(),
      });
      await database()
      .ref('/Users')
      .push({
        Name:this.state.name,
        PhoneNo:this.state.phoneNo,
        Email:this.state.email
      });
    
    console.log('Done Setting DB');
  }

  //         Register = () => {

  //                 let displayName = this.state.displayName;
  //                 let email = this.state.email;
  //                 let password = this.state.password;
  //                 let checkPassword = this.state.checkPassword;

  //                 console.log(displayName+ " " + email + " " + password + "" + checkPassword);

  //                 if (!email || !password) {
  //                         window.alert('Enter Username and Password');
  //                 }

  //                 else if (password !== checkPassword ) {
  //                         window.alert('Incorrect Password');
  //                 }

  //                 else {
  //                         auth()
  //                         .createUserWithEmailAndPassword(email, password)
  //                         .then(() => {
  //                         console.log('signed in!');
  //                         // this.props.navigation.navigate('Home');
  //                         })
  //                         .catch(error => {
  //                         if (error.code === 'auth/email-already-in-use') {
  //                         window.alert('That email address is already in use!');
  //                         }

  //                         if (error.code === 'auth/invalid-email') {
  //                         window.alert('That email address is invalid!');
  //                         }

  //                         console.error(error);
  //                         });
  //         }
  // }

  render() {
    return (
	    <ImageBackground
	    style={{
		    width: '100%',
		    height: '100%',
		}}
		imageStyle={{
			borderBottomLeftRadius: 25,
			borderBottomRightRadius: 25,
		}}
		source={require('../assets/bg.png')}
		>
          <Image
            source={require('../assets/logo.png')}
            style={{
		    width: 40,
		    height: 51,
		    resizeMode: 'contain',
		    justifyContent: 'flex-start',
		    padding: 25,
		    margin: 10,
		}}
		/>
		<ScrollView>

          <CardItem style={styles.logocard}>
            <Image
              source={require('../assets/logo.png')}
              style={{
                width: 83,
                height: 108,
                resizeMode: 'contain',
                margin: 10,
              }}
            />
          </CardItem>

          <CardItem style={styles.cardItem}>
            <Body style={styles.userBody}>
              <View style={styles.viewStyle}>
                <TextInput style={styles.textInputStyle} placeholder="Name" 
				 onChangeText={name => {
                    this.setState({name: name});
                  }}/>
              </View>

              <View style={styles.viewStyle}>
                <TextInput style={styles.textInputStyle} placeholder="Email" 
				 onChangeText={email => {
                    this.setState({email: email});
                  }}/>
              </View>

              <View style={styles.viewStyle}>
                <TextInput
                  style={styles.textInputStyle}
                  secureTextEntry={true}
				  placeholder="Password"
				  onChangeText={password => {
                    this.setState({password: password});
                  }}
                />
              </View>

              <View style={styles.viewStyle}>
                <TextInput
                  style={styles.textInputStyle}
				  placeholder="Phone No"
				  onChangeText={no => {
                    this.setState({phoneNo: no});
                  }}
                />
              </View>

			  <Button full 
			  onPress={() => {
                  this.register();
				}} 
				style={styles.buttonStyle}>
                <Text style={styles.buttonTextStyle}>Register</Text>
              </Button>
            </Body>
          </CardItem>
          <Text style={styles.linkTextStyle}>
            Already have an account?{' '}
            <Text
              style={styles.linkStyle}
              onPress={() => this.props.navigation.navigate('Login')}>
              Login Here
            </Text>
          </Text>
	  </ScrollView>
        </ImageBackground>
    );
  }
}

const styles = StyleSheet.create({
  textInputStyle: {
    fontSize: 20,
    fontFamily: 'Oxygen-Regular',
    fontWeight: '600',
    marginLeft: -10,
    paddingBottom: 3,
  },
  viewStyle: {
    borderBottomWidth: 1,
    width: '100%',
    borderBottomColor: 'gray',
    marginBottom: 25,
  },
  cardItem: {
    borderRadius: 25,
    marginTop: 20,
    alignSelf: 'center',
    width: '90%',
  },
  logocard: {
    borderRadius: 500,
    width: 200,
    height: 200,
    alignSelf: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  userBody: {
    padding: 25,
  },
  buttonStyle: {
    borderRadius: 25,

    backgroundColor: '#096348',
  },
  buttonTextStyle: {
    fontSize: 30,
    fontFamily: 'Oxygen-Bold',
    fontWeight: 'bold',
    color: 'white',
  },
  linkTextStyle: {
    alignSelf: 'center',
    marginTop: 10,
    fontFamily: 'Oxygen-Light',
  },
  linkStyle: {
    color: 'blue',
  },
});