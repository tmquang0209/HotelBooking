import React, { useEffect, useState } from "react";
import styles from "../styles";
import {
    View,
    Text,
    TouchableOpacity,
    Alert,
    RefreshControl,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";

export default function User({ navigation }) {
    const [account, setAccount] = useState(null);
    const [refreshing, setRefreshing] = useState(false);

    const fetchAccountInfo = async () => {
        const accountData = await AsyncStorage.getItem("Account");
        if (accountData) {
            const accountJSON = JSON.parse(accountData);
            setAccount(accountJSON);
        }
    };

    useFocusEffect(
        React.useCallback(() => {
            // This function will be called every time the "User" screen is displayed or in focus
            // Check if there is a new login status, then update the account data
            const checkLoggedIn = async () => {
                const isLoggedIn = await AsyncStorage.getItem("isLoggedIn");
                if (isLoggedIn === "true") fetchAccountInfo();
            };
            checkLoggedIn();
        }, []) // [] to ensure useEffect is only called once when the component is mounted
    );

    const handlePressLogin = () => {
        navigation.navigate("Login");
    };

    const handlePressManageAccount = () => {
        navigation.navigate("ManageAccount");
    };

    const handlePressChangePassword = () => {
        navigation.navigate("ChangePassword");
    };

    const handlePressBookings = () => {
        navigation.navigate("ListOrders", { account });
    };

    const handlePressManageBookings = () => {
        navigation.navigate("AdminHome", { account });
    };

    const handlePressLogout = async () => {
        Alert.alert(
            "Are you sure you want to log out?",
            "Logging out will temporarily hide all your personal data, including bookings. To see these again, just log back in to your account.",
            [
                {
                    text: "Cancel",
                },
                {
                    text: "Proceed",
                    onPress: async () => {
                        await AsyncStorage.removeItem("Account");
                        setAccount(null); // Clear the account data
                        navigation.navigate("Dashboard");
                    },
                },
            ]
        );
    };
    // console.log("account", account);

    return (
        <View style={{ flex: 1 }}>
            <View
                style={{
                    width: "100%",
                    height: 300,
                    backgroundColor: "#0071c2",
                    justifyContent: "center",
                    alignContent: "center",
                    alignItems: "center",
                }}
            >
                <Ionicons
                    name="person-circle-outline"
                    size={100}
                    color="#FFFFFF"
                />
                {account ? (
                    <View>
                        <Text style={{ fontSize: 20, color: "#FFFFFF" }}>
                            {account.full_name}
                        </Text>
                    </View>
                ) : (
                    <View
                        style={{
                            width: 350,
                            alignContent: "center",
                            alignItems: "center",
                        }}
                    >
                        <Text
                            style={{
                                color: "#FFFFFF",
                                textAlign: "center",
                            }}
                        >
                            Sign in to see deals and Genius discounts,
                        </Text>
                        <Text
                            style={{
                                color: "#FFFFFF",
                                textAlign: "center",
                                paddingBottom: 20,
                            }}
                        >
                            manage your trips, and more
                        </Text>
                        <TouchableOpacity
                            style={{
                                backgroundColor: "#003580",
                                width: 150,
                                height: 50,
                                borderRadius: 10,
                                alignItems: "center",
                                justifyContent: "center",
                            }}
                            onPress={() => handlePressLogin()}
                        >
                            <Text style={{ color: "#FFFFFF", fontSize: 15 }}>
                                Sign in
                            </Text>
                        </TouchableOpacity>
                    </View>
                )}
            </View>
            <View style={styles.container}>
                {account ? (
                    <View>
                        <TouchableOpacity
                            style={styles.menuUser}
                            onPress={() => handlePressManageAccount()}
                        >
                            <Ionicons name="person-outline" size={20} />
                            <Text style={styles.userTxt}>
                                Manage your account
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.menuUser}
                            onPress={() => handlePressBookings()}
                        >
                            <Ionicons name="briefcase-outline" size={20} />
                            <Text style={styles.userTxt}>Bookings</Text>
                        </TouchableOpacity>
                        {account.type === "admin" && (
                            <TouchableOpacity
                                style={styles.menuUser}
                                onPress={() => handlePressManageBookings()}
                            >
                                <Ionicons name="business-outline" size={20} />
                                <Text style={styles.userTxt}>
                                    Manage reservations
                                </Text>
                            </TouchableOpacity>
                        )}
                        <TouchableOpacity
                            style={styles.menuUser}
                            onPress={() => handlePressChangePassword()}
                        >
                            <Ionicons name="key-outline" size={20} />
                            <Text style={styles.userTxt}>Change password</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.menuUser}
                            onPress={handlePressLogout}
                        >
                            <Ionicons
                                name="exit-outline"
                                size={20}
                                color={"red"}
                            />
                            <Text style={[styles.userTxt, { color: "red" }]}>
                                Logout
                            </Text>
                        </TouchableOpacity>
                    </View>
                ) : null}
            </View>
        </View>
    );
}
