import React, { Component } from "react";
import { View, Text, StyleSheet } from "react-native";
import { Card, Icon } from "react-native-elements";
import firebase from "firebase";
import db from "../config.js";

import MyHeader from "../components/MyHeader";
import CustomButton from "../components/CustomButton";

export default class ExchangerDetailsScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userId: firebase.auth().currentUser.email,
      userName: "",
      exchangerId: this.props.navigation.getParam("details")["user_id"],
      exchangeId: this.props.navigation.getParam("details")["exchange_id"],
      itemName: this.props.navigation.getParam("details")["item_name"],
      description: this.props.navigation.getParam("details")[
        "description"
      ],
      itemValue: this.props.navigation.getParam("details")[
        "item_value"
      ],
      exchangerName: "",
      exchangerContact: "",
      exchangerAddress: "",
      exchangerExchangeDocId: ""
    };
  }

  getExchangerDetails = () => {
    db.collection("users")
      .where("email_id", "==", this.state.exchangerId)
      .get()
      .then(snapshot => {
        snapshot.forEach(doc => {
          this.setState({
            exchangerName: doc.data().first_name,
            exchangerContact: doc.data().contact,
            exchangerAddress: doc.data().address
          });
        });
      });

    db.collection("exchanged_items")
      .where("exchange_id", "==", this.state.exchangeId)
      .get()
      .then(snapshot => {
        snapshot.forEach(doc => {
          this.setState({ exchangerExchangeDocId: doc.id });
        });
      });
  };

  updateItemStatus = () => {
    db.collection("all_exchanges").add({
      item_name: this.state.itemName,
      exchange_id: this.state.exchangeId,
      exchanged_by: this.state.exchangerName,
      exchanger_id: this.state.userId,
      exchange_status: "Exchanger Interested"
    });
  };

  getUserDetails = userId => {
    db.collection("users")
      .where("email_id", "==", userId)
      .get()
      .then(snapshot => {
        snapshot.forEach(doc => {
          this.setState({
            userName: `${doc.data().first_name} ${doc.data().last_name}`,
            currency:doc.data().currency
          });
        });
      });
  };
  getData(){
      fetch("http://data.fixer.io/api/latest?access_key=3d3f9c097476ac7c733b245b04c4bbad")
      .then(response=>{
        return response.json();
      })
      .then(responseData=>{
        var currency  = this.state.currency;
        var value = responseData.rates.INR;
        this.setState({
          itemValue:value
        })
      })

  } 
   addNotification = () => {
    const { userName } = this.state;
    db.collection("all_notifications").add({
      targeted_user_id: this.state.exchangerId,
      exchanger_id: this.state.userId,
      exchange_id: this.state.exchangeId,
      item_name: this.state.itemName,
      date: firebase.firestore.FieldValue.serverTimestamp(),
      notification_status: "unread",
      message: `${userName} has shown interest in exchanging the item`
    });
  };

  componentDidMount() {
    const { userId } = this.state;
    this.getExchangerDetails();
    this.getUserDetails(userId);
  }

  render() {
    var {
      exchangerId,
      userId,
      itemName,
      description,
      exchangerName,
      exchangerContact,
      exchangerAddress,
      itemValue
    } = this.state;

    var itemInfoList = [
      { type: "Name", value: exchangerName },
      { type: "Contact", value: exchangerContact }
    ];

    var exchangerInfoList = [
      { type: "Name", value: itemName },
      { type: "Description", value: description },
      {type: "Item Value", value: itemValue}
    ];

    return (
      <View style={styles.container}>
        {/* Before writing MyHeader code pass props in MyHeader */}
        <MyHeader
          navigation={this.props.navigation}
          title={"Exchange Items"}
          leftComponent={
            <Icon
              name={"arrow-left"}
              type={"feather"}
              color={"#696969"}
              onPress={() => this.props.navigation.goBack()}
            />
          }
        />
        <View style={styles.upperContainer}>
          <Card title={"Item Information"} titleStyle={styles.cardTitle}>
            {itemInfoList.map((item, index) => (
              <Card key={`item-card-${index}`}>
                <Text
                  key={`item-card-value-${index}`}
                  style={{ fontWeight: "bold" }}
                >
                  {item.type}: {item.value}
                </Text>
              </Card>
            ))}
          </Card>
        </View>
        <View style={styles.middleContainer}>
          <Card title={"Exchanger Information"} titleStyle={styles.cardTitle}>
            {exchangerInfoList.map((item, index) => (
              <Card key={`exchanger-card-${index}`}>
                <Text
                  key={`exchanger-card-value-${index}`}
                  style={{ fontWeight: "bold" }}
                >
                  {item.type}: {item.value}
                </Text>
              </Card>
            ))}
          </Card>
        </View>
        <View style={styles.lowerContainer}>
          {exchangerId !== userId ? (
            <CustomButton
              title={"I want to Exchange"}
              style={styles.button}
              onPress={() => {
                this.updateItemStatus();
                this.addNotification();
                this.props.navigation.navigate("MyExchanges");
              }}
              titleStyle={styles.buttonText}
            />
          ) : null}
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  upperContainer: {
    flex: 0.3
  },
  middleContainer: {
    flex: 0.3
  },
  cardTitle: {
    fontSize: 20
  },
  lowerContainer: {
    flex: 0.3,
    justifyContent: "center",
    alignItems: "center"
  },
  button: {
    width: 200,
    height: 50,
    borderRadius: 10
  },
  buttonText: {
    fontWeight: "300"
  }
});
