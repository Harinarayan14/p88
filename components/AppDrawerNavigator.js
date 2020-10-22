import React from "react";
import { createDrawerNavigator } from "react-navigation-drawer";
import { AppTabNavigator } from "./AppTabNavigator";
import CustomSideBarMenu from "./CustomSideBarMenu";
import MyExchangeScreen from "../screens/MyExchanges";
import NotificationScreen from "../screens/Notifications";
import SettingScreen from "../screens/Setting";

export const AppDrawerNavigator = createDrawerNavigator(
  {
    Home: {
      screen: AppTabNavigator
    },
    MyExchanges: {
      screen: MyExchangeScreen
    },
    Notifications: {
      screen: NotificationScreen
    },
    Setting: {
      screen: SettingScreen
    }
  },
  {
    contentComponent: CustomSideBarMenu
  },
  {
    initialRouteName: "Home"
  }
);
