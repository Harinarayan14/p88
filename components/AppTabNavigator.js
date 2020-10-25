import React from "react";
import { StyleSheet, Image } from "react-native";
import { createBottomTabNavigator } from "react-navigation-tabs";
import { AppStackNavigator } from "./AppStackNavigator";
import ItemExchangeScreen from "../screens/ItemExchange";

export const AppTabNavigator = createBottomTabNavigator({
  AppStack: {
    screen: AppStackNavigator,
    navigationOptions: {
      tabBarIcon: (
        <Image
          source={require("../assets/home.png")}
          style={{
            width: 20,
            height: 20
          }}
        />
      ),
      tabBarLabel: "Home"
    }
  },
  ItemExchange: {
    screen: ItemExchangeScreen,
    navigationOptions: {
      tabBarIcon: (
        <Image
          source={require("../assets/exchange-item.png")}
          style={{
            width: 20,
            height: 20
          }}
        />
      ),
      tabBarLabel: "Item Exchange"
    }
  }
});
