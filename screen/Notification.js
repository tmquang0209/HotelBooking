import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    ScrollView,
    ActivityIndicator,
    RefreshControl,
} from "react-native";
import styles from "../styles";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { SafeAreaView } from "react-native";

export default function Notification() {
    const [show, setShow] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [notification, setNotification] = useState([]);
    const [account, setAccount] = useState(null);

    const onRefresh = React.useCallback(async () => {
        setRefreshing(true);
        setTimeout(() => {
            setRefreshing(false);
            getNotification();
        }, 2000);
    }, []);

    const fetchAccountInfo = async () => {
        const data = await AsyncStorage.getItem("Account");
        if (data) {
            const dataJson = JSON.parse(data);
            return dataJson;
        }
        return null;
    };

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
            return responseData.data || [];
        } catch (err) {
            console.error("Error fetching notification:", err);
            return [];
        }
    };

    const getNotification = async () => {
        try {
            const accountData = await fetchAccountInfo();
            if (accountData) {
                setAccount(accountData);
                fetchNotifications(accountData)
                    .then((notifications) => {
                        setNotification(notifications);
                    })
                    .catch((err) => {
                        console.error("Error in fetchNotifications:", err);
                    });
            } else {
                setAccount(null); // No user is logged in
                setNotification([]); // Clear notifications
            }
        } catch (err) {
            console.error("Error in fetchAccountInfo:", err);
        }
    };

    useEffect(() => {
        getNotification();
    }, [notification]);

    return (
        <ScrollView
            style={styles.container}
            refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
        >
            <SafeAreaView style={styles.container}>
                {account ? (
                    <View
                        style={{
                            justifyContent: "center",
                            alignItems: "center",
                            marginBottom: 10,
                        }}
                    >
                        <Text>
                            You have {notification.length} new notifications
                        </Text>
                    </View>
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

                <View>
                    {notification.length > 0
                        ? notification.map((item) => (
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
                        : null}
                </View>
            </SafeAreaView>
        </ScrollView>
    );
}
