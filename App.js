import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Ionicons from "react-native-vector-icons/Ionicons";
import { StatusBar } from "react-native";

import Home from "./screen/Home";
import Search from "./screen/Search";
import ListRooms from "./screen/ListRooms";
import Details from "./screen/Details";
import Book from "./screen/Book";
import Success from "./screen/Success";
import SearchOrder from "./screen/SearchOrder";
import OrderDetails from "./screen/OrderDetails";
import Notification from "./screen/Notification";
import Login from "./screen/Login";
import Signup from "./screen/Signup";
import User from "./screen/User";
import ManageAccount from "./screen/ManageAccount";
import ForgotPassword from "./screen/ForgotPassword";
import ListOrders from "./screen/ListOrder";
import AdminHome from "./screen/AdminHome";
import ChangePassword from "./screen/ChangePassword";
import ListHotels from "./screen/ListHotels";
import ListBookings from "./screen/ListBookings";
import HotelDetail from "./screen/HotelDetail";
import AddHotel from "./screen/AddHotel";
import ListLocations from "./screen/ListLocations";
import LocationDetail from "./screen/LocationDetail";
import AddLocation from "./screen/AddLocation";
import ListUsers from "./screen/ListUsers";
import UserDetail from "./screen/UserDetail";

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
                headerShown: false,
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
            <BottomTab.Screen
                name="Notification"
                component={Notification}
                // options={{ tabBarBadge: "" }}
            />
            <BottomTab.Screen
                name="User"
                options={{ title: "User" }}
                component={User}
            />
        </BottomTab.Navigator>
    );
}

export default function App() {
    return (
        <NavigationContainer>
            <Stack.Navigator options={{ headerShown: false }}>
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
                <Stack.Screen name="ListOrders" component={ListOrders} />
                <Stack.Screen name="OrderDetails" component={OrderDetails} />
                <Stack.Screen name="Notification" component={Notification} />
                <Stack.Screen name="Login" component={Login} />
                <Stack.Screen name="Signup" component={Signup} />
                <Stack.Screen
                    name="ForgotPassword"
                    component={ForgotPassword}
                />
                <Stack.Screen name="ManageAccount" component={ManageAccount} />
                <Stack.Screen
                    name="ChangePassword"
                    component={ChangePassword}
                />
                <Stack.Screen name="AdminHome" component={AdminHome} />
                <Stack.Screen name="ListHotels" component={ListHotels} />
                <Stack.Screen name="ListBookings" component={ListBookings} />
                <Stack.Screen name="HotelDetail" component={HotelDetail} />
                <Stack.Screen name="AddHotel" component={AddHotel} />
                <Stack.Screen name="AddLocation" component={AddLocation} />
                <Stack.Screen name="ListLocations" component={ListLocations} />
                <Stack.Screen name="ListUsers" component={ListUsers} />
                <Stack.Screen
                    name="LocationDetail"
                    component={LocationDetail}
                />
                <Stack.Screen
                    name="UserDetail"
                    component={UserDetail}
                />
            </Stack.Navigator>
            <StatusBar auto />
        </NavigationContainer>
    );
}
