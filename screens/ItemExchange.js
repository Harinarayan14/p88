import React, { Component } from "react";
import {
  View,
  KeyboardAvoidingView,
  StyleSheet,
  Alert,
  Text
} from "react-native";
import db from "../config";
import firebase from "firebase";

import MyHeader from "../components/MyHeader";
import CustomButton from "../components/CustomButton";
import CustomInput from "../components/CustomInput";

export default class ItemExchangeScreen extends Component {
  constructor() {
    super();
    this.state = {
      userId: firebase.auth().currentUser.email,
      itemName: "",
      description: "",
      isItemExchangeActive: "",
      exchangedItemName: "",
      itemStatus: "",
      exchangeId: "",
      userDocId: "",
      docId: ""
    };
  }

  getUniqueId() {
    return Math.random()
      .toString(36)
      .substring(7);
  }

  handleItemExchange = async (itemName, description) => {
    var { userId } = this.state;
    var randomExchangeId = this.getUniqueId();
    if (itemName && description) {
      db.collection("exchanged_items").add({
        user_id: userId,
        item_name: itemName,
        description: description,
        exchange_id: randomExchangeId,
        item_status: "exchanged",
        date: firebase.firestore.FieldValue.serverTimestamp()
      });

      await this.getExchangedItems();
      db.collection("users")
        .where("email_id", "==", userId)
        .get()
        .then()
        .then(snapshot => {
          snapshot.forEach(doc => {
            db.collection("users")
              .doc(doc.id)
              .update({
                is_item_exchange_active: true
              });
          });
        });

      this.setState({
        itemName: "",
        description: "",
        exchangeId: randomExchangeId
      });
      Alert.alert("Item Exchanged Successfully");
    } else {
      Alert.alert("Fill the details properly");
    }
  };

  getExchangedItems = () => {
    // getting the exchanged item
    const { userId } = this.state;
    db.collection("exchanged_items")
      .where("user_id", "==", userId)
      .get()
      .then(snapshot => {
        snapshot.docs.map(doc => {
          const details = doc.data();
          if (details.item_status !== "exchanged") {
            this.setState({
              exchangeId: details.exchange_id,
              exchangedItemName: details.item_name,
              itemStatus: details.item_status,
              docId: doc.id
            });
          }
        });
      });
  };

  getActiveItemExchange = () => {
    const { userId } = this.state;
    db.collection("users")
      .where("email_id", "==", userId)
      .onSnapshot(snapshot => {
        snapshot.docs.map(doc => {
          const details = doc.data();
          this.setState({
            isItemExchangeActive: details.is_item_exchange_active,
            userDocId: doc.id
          });
        });
      });
  };

  componentDidMount() {
    this.getExchangedItems();
    this.getActiveItemExchange();
  }

  sendNotification = () => {
    //to get the first name and last name
    const { userId, exchangeId } = this.state;

    db.collection("users")
      .where("email_id", "==", userId)
      .get()
      .then(snapshot => {
        snapshot.docs.map(doc => {
          var name = doc.data().first_name;
          var lastName = doc.data().last_name;
          // to get the exchanger id and item nam
          db.collection("all_notifications")
            .where("exchange_id", "==", exchangeId)
            .get()
            .then(snapshot => {
              snapshot.docs.map(doc => {
                const exchangerId = doc.data().exchanger_id;
                const itemName = doc.data().item_name;
                const message = `${name} ${lastName} exchanged the item ${itemName}`;
                //targert user id is the exchanger id to send notification to the user
                db.collection("all_notifications").add({
                  targeted_user_id: exchangerId,
                  message: message,
                  notification_status: "unread",
                  item_name: itemName
                });
              });
            });
        });
      });
  };

  updateItemExchangeStatus = () => {
    //updating the item status after exchanging the item
    const { userId, docId } = this.state;
    db.collection("exchanged_items")
      .doc(docId)
      .update({
        item_status: "exchanged"
      });

    //getting the  doc id to update the users doc
    db.collection("users")
      .where("email_id", "==", userId)
      .get()
      .then(snapshot => {
        snapshot.docs.map(doc => {
          //updating the doc
          db.collection("users")
            .doc(doc.id)
            .update({
              is_item_exchange_active: false
            });
        });
      });
  };

  exchangedItems = itemName => {
    const { userId, exchangeId } = this.state;
    db.collection("exchanged_items").add({
      user_id: userId,
      item_name: itemName,
      exchange_id: exchangeId,
      itemStatus: "exchanged"
    });
  };

  render() {
    var {
      itemName,
      description,
      isItemExchangeActive,
      exchangedItemName,
      itemStatus
    } = this.state;

    return (
      <View style={styles.container}>
        <MyHeader title="Exchange Item" navigation={this.props.navigation} />
        {isItemExchangeActive ? (
          <View style={styles.exchangedItemContainer}>
            <View style={styles.exchangedItemSubContainer}>
              <Text>Item Name</Text>
              <Text>{exchangedItemName}</Text>
            </View>
            <View style={styles.exchangedItemSubContainer}>
              <Text>Item Status</Text>
              <Text>{itemStatus}</Text>
            </View>
            <CustomButton
              title={"I exchanged the item"}
              onPress={() => {
                const { exchangedItemName } = this.state;
                this.sendNotification();
                this.updateItemExchangeStatus();
                this.exchangedItems(exchangedItemName);
              }}
              style={styles.button}
              titleStyle={styles.buttonTitle}
            />
          </View>
        ) : (
          <KeyboardAvoidingView style={styles.upperContainer}>
            <CustomInput
              style={[styles.input, { height: 75 }]}
              inputContainerStyle={{ height: 60 }}
              label={"Item Name"}
              labelStyle={{ fontSize: 20 }}
              placeholder={"Item name"}
              onChangeText={text => {
                this.setState({
                  itemName: text
                });
              }}
              value={itemName}
            />
            <CustomInput
              style={[styles.input, { height: 170 }]}
              inputContainerStyle={{ height: 140 }}
              label={"Description"}
              labelStyle={{ fontSize: 20 }}
              multiline
              numberOfLines={8}
              placeholder={"Description"}
              onChangeText={text => {
                this.setState({
                  description: text
                });
              }}
              value={description}
            />
            <CustomButton
              title={"Make a exchange"}
              onPress={() => this.handleItemExchange(itemName, description)}
              style={styles.button}
              titleStyle={styles.buttonTitle}
            />
          </KeyboardAvoidingView>
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  upperContainer: {
    flex: 1,
    alignItems: "center"
  },
  input: {
    width: "90%",
    height: 65,
    borderColor: "#aaff55",
    borderWidth: 0,

    alignItems: "flex-start",
    marginTop: 30
  },
  button: {
    marginTop: 20,
    backgroundColor: "#7788dd",
    alignSelf: "center"
  },
  buttonTitle: {
    color: "#f1f"
  },
  exchangedItemContainer: {
    flex: 1,
    justifyContent: "center"
  },
  exchangedItemSubContainer: {
    borderColor: "#11ff11",
    borderWidth: 2,
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
    margin: 10
  }
});
