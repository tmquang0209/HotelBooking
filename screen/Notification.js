﻿import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    ScrollView,
    ActivityIndicator,
    FlatList,
    RefreshControl,
} from "react-native";
import styles from "../styles";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { SafeAreaView } from "react-native";

export default function Notification() {
    const [show, setShow] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [notification, setNotification] = useState();
    const [account, setAccount] = useState();

    const onRefresh = React.useCallback(async () => {
        setRefreshing(true);
        setTimeout(() => {
            setRefreshing(false);
            getNotification();
        }, 2000);
    }, []);

    // Function to fetch the account information from AsyncStorage
    const fetchAccountInfo = async () => {
        const data = await AsyncStorage.getItem("Account");
        if (data) {
            const dataJson = JSON.parse(data);
            return dataJson;
        }
        return null; // Handle the case where account data is not found
    };

    // Function to fetch notifications using axios
    const fetchNotifications = async (account) => {
        const options = {
            method: "GET",
            url: "https://api.toluu.site/post/notification.php",
            params: {
                account,
            },
        };

        try {
            setShow(true);
            const response = await axios.request(options);
            const responseData = response.data;
            setShow(false);
            // console.log(responseData);
            return responseData.data || []; // Return an empty array if no data
        } catch (err) {
            console.error("Error fetching notification:", err);
            return []; // Handle the error by returning an empty array
        }
    };

    const getNotification = async () => {
        try {
            const accountData = await fetchAccountInfo();
            if (accountData) {
                setAccount(accountData);

                const notifications = await fetchNotifications(accountData);
                setNotification(notifications);
            }
        } catch (err) {
            console.error("Error in getNotification:", err);
        }
    };

    useEffect(() => {
        getNotification();
    }, []);
    // console.log(account);
    // console.log("noti", notification);
    return (
        <ScrollView
            style={styles.container}
            refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
        >
            <SafeAreaView style={styles.container}>
                {/* <ActivityIndicator size="large" animating={show} /> */}
                {account ? (
                    <View
                        style={{
                            justifyContent: "center",
                            alignItems: "center",
                            marginBottom: 10,
                        }}
                    >
                        <Text>
                            You have {notification ? notification.length : 0}{" "}
                            new notification
                        </Text>
                    </View>
                ) : (
                    ""
                )}

                <View>
                    {notification ? (
                        notification.map((item) => (
                            <View
                                style={{
                                    borderWidth: 1,
                                    padding: 10,
                                    borderRadius: 10,
                                    marginBottom: 10,
                                }}
                                key={item.id}
                            >
                                <Text style={{ color: "gray" }}>
                                    {item.date}
                                </Text>
                                <Text>{item.content}</Text>
                            </View>
                        ))
                    ) : (
                        <View
                            style={{
                                justifyContent: "center",
                                alignItems: "center",
                            }}
                        >
                            <Text>Sign in to receive notifications</Text>
                        </View>
                    )}
                </View>
            </SafeAreaView>
        </ScrollView>
    );
}
