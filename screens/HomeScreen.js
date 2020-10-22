import React, { Component } from "react";
import { View, StyleSheet, FlatList, Text } from "react-native";
import { ListItem, Icon } from "react-native-elements";
import firebase from "firebase";
import db from "../config";
import MyHeader from "../components/MyHeader";
import CustomButton from "../components/CustomButton";

export default class HomeScreen extends Component {
  constructor() {
    super();
    this.state = {
      exchangedItemsList: []
    };
    this.exchangeRef = null;
  }

  componentDidMount() {
    this.getExchangedItemsList();
  }

  getExchangedItemsList = () => {
    this.exchangeRef = db.collection("exchanged_items").onSnapshot(
      snapshot => {
        var exchangedItemsList = snapshot.docs.map(document => document.data());
        this.setState({
          exchangedItemsList: exchangedItemsList
        });
      },
      error => {
        this.exchangeRef();
      }
    );
  };

  componentWillUnmount() {
    this.exchangeRef();
  }

  keyExtractor = (item, index) => index.toString();

  renderItem = ({ item, i }) => {
    return (
      <ListItem
        key={i}
        title={item.item_name}
        subtitle={item.reason_to_exchange}
        titleStyle={{ color: "black", fontWeight: "bold" }}
        rightElement={
          <Icon
            name={"open-in-new"}
            type={"material-icons"}
            size={30}
            color={"#6fc0b8"}
            containerStyle={{
              width: 100,
              alignItems: "flex-end"
            }}
            onPress={() => {
              this.props.navigation.navigate("ExchangerDetails", {
                details: item
              });
            }}
          />
        }
        bottomDivider
      />
    );
  };

  render() {
    var { exchangedItemsList } = this.state;
    return (
      <View style={styles.container}>
        <MyHeader title={"Exchange Items"} navigation={this.props.navigation} />
        {this.state.exchangedItemsList.length === 0 ? (
          <View style={styles.emptyListContainer}>
            <Text style={styles.title}>List Of All Exchanged Items</Text>
          </View>
        ) : (
          <FlatList
            keyExtractor={this.keyExtractor}
            data={exchangedItemsList}
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
  emptyListContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  title: {
    fontSize: 20
  },
  button: {
    width: 100,
    height: 40
  },
  buttonText: {
    fontWeight: "400"
  }
});
