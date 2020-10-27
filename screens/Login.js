import React, { Component } from "react";
import {
  View,
  StyleSheet,
  Text,
  Alert,
  Image,
  SafeAreaView
} from "react-native";
import db from "../config";
import firebase from "firebase";

import CustomInput from "../components/CustomInput";
import CustomButton from "../components/CustomButton";
import SignUpModal from "../components/Login/SignUpModal";

export default class LoginScreen extends Component {
  constructor() {
    super();
    this.state = {
      email: "",
      password: "",
      firstName: "",
      lastName: "",
      address: "",
      contact: "",
      confirmPassword: "",
      currency:"",
      isModalVisible: false
    };
  }

  handleLogin = (email, password) => {
    firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .then(() => {
        this.props.navigation.navigate("Home");
      })
      .catch(error => {
        Alert.alert(error.message);
      });
  };

  handleSignUp = () => {
    this.setState({ isModalVisible: true });
  };

  handleSubmit = () => {
    var {
      firstName,
      lastName,
      contact,
      address,
      email,
      password,
      confirmPassword,
      currency
    } = this.state;

    if (password !== confirmPassword) {
      Alert.alert("password doesn't match\nCheck your password.");
    } else {
      firebase
        .auth()
        .createUserWithEmailAndPassword(email, password)
        .then(() => {
          db.collection("users").add({
            first_name: firstName,
            last_name: lastName,
            contact: contact,
            email_id: email,
            address: address,
            currency:currency,
            is_item_exchange_active: false
          });
          Alert.alert("User Added Successfully", "", [
            {
              text: "OK",
              onPress: () => this.setState({ isModalVisible: false })
            }
          ]);
        })
        .catch(error => {
          Alert.alert(error.message);
        });
    }
  };

  render() {
    var { email, password, isModalVisible } = this.state;

    return (
      <View style={styles.container}>
        <SafeAreaView />
        <View style={styles.upperContainer}>
          <Text>Barter System App</Text>
        </View>
        <View style={styles.middleContainer}>
          <CustomInput
            placeholder={"Email id"}
            keyboardType={"email-address"}
            onChangeText={text => {
              this.setState({
                email: text
              });
            }}
          />
          <CustomInput
            secureTextEntry={true}
            placeholder={"Password"}
            onChangeText={text => {
              this.setState({
                password: text
              });
            }}
          />
          <CustomButton
            title={"Login"}
            onPress={() => this.handleLogin(email, password)}
          />
          <CustomButton
            title={"Sign up"}
            onPress={() => this.handleSignUp(email, password)}
          />
        </View>
        <SignUpModal
          setFirstName={text => this.setState({ firstName: text })}
          setLastName={text => this.setState({ lastName: text })}
          setContact={text => this.setState({ contact: text })}
          setAddress={text => this.setState({ address: text })}
          setEmail={text => this.setState({ email: text })}
          setPassword={text => this.setState({ password: text })}
          setConfirmPassword={text => this.setState({ confirmPassword: text })}
          setCurrency={text => this.setState({ currency: text })}
          onSubmit={() => this.handleSubmit()}
          onCancle={() => {
            this.setState({ isModalVisible: false });
          }}
          visible={isModalVisible}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#aa55ff"
  },
  upperContainer: {
    flex: 0.25,
    justifyContent: "center",
    alignItems: "center"
  },
  image: {
    width: 250,
    height: 250,
    resizeMode: "contain"
  },
  middleContainer: {
    flex: 0.42,
    alignItems: "center",
    justifyContent: "space-evenly"
  },
  bookImage: {
    width: "100%",
    height: "100%",
    resizeMode: "contain"
  }
});
