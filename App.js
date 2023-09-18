import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Ionicons from "react-native-vector-icons/Ionicons";
import DeviceInfo, {
    getUniqueId,
    getManufacturer,
} from "react-native-device-info";

import Home from "./screen/Home";
import Search from "./screen/Search";
import ListRooms from "./screen/ListRooms";
import Details from "./screen/Details";
import Book from "./screen/Book";
import Success from "./screen/Success";
import SearchOrder from "./screen/SearchOrder";
import OrderDetails from "./screen/OrderDetails";
import Notification from "./screen/Notification";

const Stack = createNativeStackNavigator();
const BottomTab = createBottomTabNavigator();

function Tab() {
    return (
        <BottomTab.Navigator
            screenOptions={({ route }) => ({
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName;

                    if (route.name === "Dashboard") {
                        iconName = focused ? "home" : "home-outline";
                    } else if (route.name === "OrderSearch") {
                        iconName = focused ? "search" : "search-outline";
                    } else if (route.name === "Notification") {
                        iconName = focused
                            ? "notifications"
                            : "notifications-outline";
                    } else if (route.name === "User") {
                        iconName = focused ? "person" : "person-outline";
                    }
                    // You can return any component that you like here!
                    return (
                        <Ionicons name={iconName} size={size} color={color} />
                    );
                },
                tabBarActiveTintColor: "#2196F3",
                tabBarInactiveTintColor: "gray",
            })}
        >
            <BottomTab.Screen
                name="Dashboard"
                options={{ title: "Home" }}
                component={Home}
                // options={{ headerShown: false }}
            />
            <BottomTab.Screen
                name="OrderSearch"
                options={{ title: "Search" }}
                component={SearchOrder}
            />
            <BottomTab.Screen name="Notification" component={Home} />
            <BottomTab.Screen
                name="User"
                options={{ title: "User" }}
                component={Home}
            />
        </BottomTab.Navigator>
    );
}

export default function App() {
    let deviceId = DeviceInfo.getDeviceId();
    console.log(deviceId);
    return (
        <NavigationContainer>
            <Stack.Navigator>
                <Stack.Screen
                    name="TabScreen"
                    component={Tab}
                    options={{ headerShown: false }}
                />
                <Stack.Screen name="Search" component={Search} />
                <Stack.Screen name="ListRooms" component={ListRooms} />
                <Stack.Screen name="Details" component={Details} />
                <Stack.Screen name="Book" component={Book} />
                <Stack.Screen name="Success" component={Success} />
                <Stack.Screen name="OrderDetails" component={OrderDetails} />
                <Stack.Screen name="Notification" component={Notification} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}
