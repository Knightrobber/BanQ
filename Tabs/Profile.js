import React, { Component } from 'react';
import { ImageBackground, StyleSheet, View, Image, TextInput, ScrollView } from 'react-native';
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
} from 'native-base';

import auth from '@react-native-firebase/auth';
import database from '@react-native-firebase/database';


export default class Profile extends Component {

  constructor() {
    super();
    this.state = {
      editButton: false,
      Id: '',
      name: '',
      email: '',
      telephone: '',
      nameplaceholder: '',
      telephoneplaceholder: '',
    }
  }


  async componentDidMount() {
    await auth().onAuthStateChanged(async (user) => {
      if (!user) console.log('error has occured in authstatechanged ');
      if (user) {
        console.log('The is the user ' + user);
        let userName = user.email;
        userName = userName.split('@');
        if (userName[0].includes('.'))
          userName[0] = userName[0].replace(/[.]/g, '+');
        let Id = userName[0];
        console.log(Id);
        await this.setState({
          Id: Id,
          email: Id + "@snu.edu.in"
        });
        await database().ref("Users").once('value', snap => {
          snap.forEach(subSnap => {
            if (subSnap.val().Email == this.state.email) {
              console.log("found it")
              console.log(subSnap.val())
              this.setState({
                name: subSnap.val().Name,
                telephone: subSnap.val().PhoneNo,
                email: subSnap.val().Email
              })
            }
          })
        })
      }
      //let Id = "rt347"
      console.log(Id);
      console.log('In auth chnage');
    });

  }

  logout = () => {
    auth()
      .signOut()
      .then(() => {
        console.log('User signed out!');
        this.props.navigation.navigate('Auth');
      });
  };

  toggleEditButton = () => {
    this.setState({
      editButton: !this.state.editButton
    })
  }


  saveChanges = () => {

    let name = this.state.nameplaceholder
    let testFlagName = false
    if (name.length > 0) {
      for (let i = 0; i < name.length; i++) {
        if ((name[i] >= 'a' && name[i] <= 'z') || (name[i] >= 'A' && name[i] <= 'Z') || (name[i] == ' ')) {
          testFlagName = true
        }
        else {
          testFlagName = false
          break
        }
      }
    }
    console.log("test name")
    console.log(testFlagName)
    let tel = this.state.telephoneplaceholder
    // let count = 0
    let testFlagPh = false
    if (tel.length == 10) {
      for (let i = 0; i < tel.length; i++) {
        if (tel[i] >= '0' && tel[i] <= '9') {
          testFlagPh = true
        }
        else {
          testFlagPh = false
          break
        }
      }
    }
    console.log("test tel")
    console.log(testFlagPh)
    if (testFlagPh == false && testFlagName == false)
      alert("Invalid Input. Enter again")
    else if (testFlagPh == false)
      alert("Invalid Mobile Number. Enter again")
    else if (testFlagName == false)
      alert("Invalid Name. Enter again")
    else {
      this.setState(
        {
          name: this.state.nameplaceholder,
          telephone: this.state.telephoneplaceholder
        }
      )
      this.toggleEditButton()
    }

  }


  openEdit = () => {
    if (this.state.editButton) {
      return (
        <View
          style={{
            backgroundColor: 'white',
            width: '90%',
            alignSelf: 'center',
            borderRadius: 25,
            marginTop: 10,
            padding: 20
          }}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingRight: 10,
              paddingLeft: 10,
            }}>
            <Text style={{ fontSize: 15, fontFamily: 'Oxygen' }}>Name:</Text>
            <TextInput
              style={{ fontSize: 15, fontFamily: 'Oxygen' }}
              placeholder="enter here"
              onChangeText={(input) => {
                this.setState({ nameplaceholder: input });
              }}
            />
          </View>
          {/* <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingRight: 10,
              paddingLeft: 10,
            }}>
            <Text style={{ fontSize: 15, fontFamily: 'Oxygen' }}>Email:</Text>
            <TextInput
              placeholder="enter here"
              onChangeText={(input) => {
                this.setState({ email: input });
              }}
              style={{ fontSize: 15, fontFamily: 'Oxygen' }}
            />
          </View> */}
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingRight: 10,
              paddingLeft: 10,
            }}>
            <Text style={{ fontSize: 15, fontFamily: 'Oxygen' }}>Mobile:</Text>
            <TextInput
              placeholder="enter here"
              onChangeText={(input) => {
                this.setState({ telephoneplaceholder: input });
              }}
              style={{ fontSize: 15, fontFamily: 'Oxygen' }}
            />
          </View>
          {/* <Button title="save changes" onPress={() => { this.saveChangesYouAreOwed() }}></Button> */}
          <Button
            full
            style={{
              marginTop: 5,
              marginBottom: 10,
              borderRadius: 25,
              backgroundColor: 'gray',
              alignSelf: 'center',
              width: '50%',
            }}
            onPress={() => this.saveChanges()}>
            <Text style={styles.buttonTextStyle2}>Save Changes</Text>
          </Button>
        </View>
      )
    }
  }

  render() {
    return (
      <ImageBackground
        style={styles.imgBackground}
        imageStyle={styles.imgBG}
        source={require('../assets/bg.png')}>
        <Image
          source={require('../assets/logo.png')}
          style={styles.logoStyle}
        />
        <ScrollView>
          <View>
            

            <Card
              style={{
                alignSelf: 'center',
                padding: 20,
                height: 100,
                width: 350,
                borderRadius: 20,
              }}>
              <Body
                style={{
                  textAlign: 'left',
                  padding: 0,
                  height: 100,
                  width: 300,
                  borderRadius: 20,
                }}>
                <Text style={styles.largeTextHead}>{this.state.name}</Text>
                <Text note style={styles.smallTextHead}>
                  Shiv Nadar University
              </Text>
              </Body>
            </Card>
            <View>
              {this.openEdit()}
            </View>
            <Card
              style={{
                alignSelf: 'center',
                padding: 20,
                height: 200,
                width: 350,
                borderRadius: 20,
              }}>
              <Grid>
                <Body
                  style={{
                    textAlign: 'left',
                    padding: 0,
                    height: 100,
                    width: 300,
                    borderRadius: 20,
                    marginTop: 50,
                    paddingBottom: 10,
                  }}>
                  <Text style={styles.largeText}>Settings</Text>
                </Body>
              </Grid>
              <View>
                <Grid style={{ marginLeft: -40, marginTop: 10, paddingBottom: 30 }}>
                  <Col>
                    <Body
                      style={{
                        textAlign: 'left',
                        padding: 0,
                        height: 100,
                        width: 300,
                        borderRadius: 20,
                      }}>
                      <Icon
                        type="FontAwesome"
                        name="envelope"
                        style={{ fontSize: 30, color: '#1EE1A8' }}
                      />
                    </Body>
                  </Col>
                  <Col>
                    <Body>
                      <Text style={styles.rightTextSmall}>{this.state.email}</Text>
                    </Body>
                  </Col>
                </Grid>

                <Grid style={{ marginLeft: -40, marginTop: 10, paddingBottom: 30 }}>
                  <Col>
                    <Body
                      style={{
                        textAlign: 'left',
                        padding: 0,
                        height: 100,
                        width: 300,
                        borderRadius: 20,
                      }}>
                      <Icon
                        type="FontAwesome"
                        name="phone-square"
                        style={{ fontSize: 30, color: '#38A5C7' }}
                      />
                    </Body>
                  </Col>
                  <Col>
                    <Body>
                      <Text style={styles.rightTextSmall}>{this.state.telephone}</Text>
                    </Body>
                  </Col>
                </Grid>

                {/* <Grid style={{marginLeft: -40, marginTop: 10, paddingBottom: 30}}>
              <Col>
                <Body
                  style={{
                    textAlign: 'left',
                    padding: 0,
                    height: 100,
                    width: 300,
                    borderRadius: 20,
                  }}>
                  <Icon
                    type="FontAwesome"
                    name="key"
                    style={{fontSize: 30, color: '#DD1243'}}
                  />
                </Body>
              </Col>
              <Col>
                <Body>
                  <Text style={styles.rightTextSmall}>Edit</Text>
                </Body>
              </Col>
            </Grid> */}

               

               

                {/* EDIT BUTTOM IS HERE */}
                <View style={{ justifyContent: 'center', alignSelf: 'center' }}>
                  <Button
                    full
                    onPress={() => this.toggleEditButton()}
                    style={{ alignItems: "center", justifyContent: "center", borderRadius: 25, backgroundColor: 'gray' }}>
                    <Text style={{ fontSize: 15, fontFamily: 'Oxygen' }}>Edit</Text>
                  </Button>
                </View>
              </View>
            </Card>

            <View style={{ justifyContent: 'center', alignItems: 'center' }}>
              <Button
                rounded
                onPress={() => { this.logout() }}
                style={styles.buttonStyleLogout}>
                <Text style={styles.buttonTextStyle}>Logout</Text>
              </Button>
            </View>
          </View>
        </ScrollView>

        {/* LOGOUT */}
      </ImageBackground>
    );
    // } else {
    //   return (
    //     <View>
    //       <Button title="close" onPress={this.close} />
    //       <NavBar />
    //     </View>
    //   );
    // }
  }
}

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
  },
  largeText: {
    color: 'black',
    fontFamily: 'Oxygen-Bold',
    fontSize: 30,
  },
  logocard: {
    borderRadius: 300,
    width: 150,
    height: 150,
    alignSelf: 'center',
    justifyContent: 'center',
    marginTop: 20,
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
  },
  rightTextSmall: {
    color: 'black',
    fontFamily: 'Oxygen-Regular',
    fontSize: 15,
  },
  buttonStyleLogout: {
    borderRadius: 25,
    width: '90%',
    justifyContent: 'center',
    alignSelf: 'center',
    backgroundColor: '#EA5656',
    marginTop: 10,
  },
  buttonTextStyle: {
    fontSize: 20,
    fontFamily: 'Oxygen-Bold',
    fontWeight: 'bold',
    color: 'white',
  },
});