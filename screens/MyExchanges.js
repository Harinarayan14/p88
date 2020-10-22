import React, { Component } from "react";
import { StyleSheet, View, Text, FlatList } from "react-native";
import { Icon, ListItem } from "react-native-elements";
import firebase from "firebase";
import db from "../config.js";

import MyHeader from "../components/MyHeader";
import CustomButton from "../components/CustomButton";

export default class MyExchangeScreen extends Component {
  constructor() {
    super();
    this.state = {
      exchangerId: firebase.auth().currentUser.email,
      allExchanges: []
    };
    this.exchangeRef = null;
  }

  componentDidMount() {
    this.getExchanges();
  }

  getExchanges = () => {
    const { exchangerId } = this.state;
    this.exchangeRef = db
      .collection("all_exchanges")
      .where("exchanger_id", "==", exchangerId)
      .onSnapshot(
        snapshot => {
          let exchanges = [];
          snapshot.docs.map(doc => {
            let details = doc.data();
            details["doc_id"] = doc.id;
            exchanges.push(details);
          });
          this.setState({
            allExchanges: exchanges
          });
        },
        () => {
          this.exchangeRef();
        }
      );
  };

  handleSendItem = itemDetails => {
    const exchangeRef = db.collection("all_exchanges").doc(itemDetails.doc_id);
    const { exchange_status } = itemDetails;
    const exchangeStatus =
      exchange_status === "Item Sent" ? "Exchanger Interested" : "Item Sent";

    exchangeRef.update({
      exchange_status: exchangeStatus
    });
    this.sendNotification(itemDetails, exchangeStatus);
  };

  sendNotification = (itemDetails, exchangeStatus) => {
    const { exchange_id, exchanger_id } = itemDetails;
    db.collection("all_notifications")
      .where("exchange_id", "==", exchange_id)
      .where("exchanger_id", "==", exchanger_id)
      .get()
      .then(snapshot => {
        snapshot.docs.map(doc => {
          const message =
            exchangeStatus === "Item Sent"
              ? `${this.state.exchangerName} sent you item`
              : `${this.state.exchangerName} has shown interest in exchanging the item`;

          db.collection("all_notifications")
            .doc(doc.id)
            .update({
              message: message,
              notification_status: "unread",
              date: firebase.firestore.FieldValue.serverTimestamp()
            });
        });
      });
  };

  componentWillUnmount() {
    this.exchangeRef();
  }

  keyExtractor = (item, index) => index.toString();

  renderItem = ({ item, i }) => (
    <ListItem
      key={i}
      title={item.item_name}
      subtitle={
        "Exchanged By : " +
        item.exchanged_by +
        "\nStatus : " +
        item.exchange_status
      }
      leftElement={<Icon name="item" type="font-awesome" color="#696969" />}
      titleStyle={styles.title}
      rightElement={
        <CustomButton
          title={
            item.exchange_status === "Item Sent" ? "Item Sent" : "Send Item"
          }
          style={[
            styles.button,
            {
              backgroundColor:
                item.exchange_status === "Item Sent" ? "green" : "#fff"
            }
          ]}
          titleStyle={[
            styles.buttonText,
            {
              color: item.exchange_status === "Item Sent" ? "#fff" : "#000"
            }
          ]}
          onPress={() => {
            this.handleSendItem(item);
          }}
        />
      }
      bottomDivider
    />
  );

  render() {
    return (
      <View sytyle={styles.container}>
        <MyHeader navigation={this.props.navigation} title="My Exchanges" />
        {this.state.allExchanges.length === 0 ? (
          <View style={styles.emptyList}>
            <Text style={styles.emptyListTitle}>
              List of all item Exchanges
            </Text>
          </View>
        ) : (
          <FlatList
            keyExtractor={this.keyExtractor}
            data={this.state.allExchanges}
            renderItem={this.renderItem}
          />
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  title: {
    color: "#1fa",
    fontWeight: "bold"
  },
  emptyList: {
    flex: 1,
    fontSize: 20,
    justifyContent: "center",
    alignItems: "center"
  },
  emptyListTitle: {
    fontSize: 20
  },
  button: {
    width: 110,
    height: 45
  },
  buttonText: {
    fontSize: 17
  }
});
